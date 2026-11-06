import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, first, switchMap, take, tap, timer } from 'rxjs';
import { AppSnackbar } from '../../classes/app-snackbar';
import { Escopo } from '../../classes/escopo';
import { messageError } from '../../classes/util';
import { salvarArquivo } from '../../classes/salvar-arquivo';
import { TarefaModel, TarefaStatus } from '../../../models/tarefa-model';
import { TarefaService } from '../../../services/tarefa.service';
import { RelatorioDialogData } from './relatorio-dialog-data';

/** Acompanhamento curto: o diálogo espera pouco; depois disso o usuário segue a tarefa pela tela de tarefas. */
const POLLING_INICIO_MS = 800; // o backend começa a tarefa na hora, então a 1ª consulta já pode ter resultado
const POLLING_INTERVALO_MS = 1000;
const POLLING_TENTATIVAS = 15; // ~15 s no total

type Estado = 'form' | 'processando' | 'finalizando' | 'demorando' | 'erro';

@Component({
  selector: 'app-relatorio-dialog',
  templateUrl: './relatorio-dialog.component.html',
  styleUrl: './relatorio-dialog.component.css',
})
export class RelatorioDialogComponent implements OnInit, OnDestroy {
  inscricaoTarefa!: Subscription;
  inscricaoPolling!: Subscription;
  inscricaoFinal!: Subscription;

  formulario: FormGroup;
  escopos: Escopo[] = [
    { sigla: 'T', descricao: 'Toda Consulta' },
    { sigla: 'P', descricao: 'Página Atual' },
  ];

  estado: Estado = 'form';
  tentativa: number = 0;
  maxTentativas: number = POLLING_TENTATIVAS;
  mensagem: string = '';
  tarefa: TarefaModel = new TarefaModel();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RelatorioDialogComponent>,
    private tarefaSrv: TarefaService,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: RelatorioDialogData,
  ) {
    this.formulario = formBuilder.group({
      destinatario: [{ value: '', disabled: true }],
      escopo: [''],
    });
  }

  ngOnInit(): void {
    this.formulario.patchValue({
      destinatario: this.data.destinatario,
      escopo: this.data.escopo,
    });
  }

  ngOnDestroy(): void {
    // fechar o diálogo só para de acompanhar: a tarefa continua no servidor
    this.inscricaoTarefa?.unsubscribe();
    this.inscricaoPolling?.unsubscribe();
    this.inscricaoFinal?.unsubscribe();
  }

  get ocupado(): boolean {
    return this.estado === 'processando' || this.estado === 'finalizando';
  }

  get textoFechar(): string {
    return this.estado === 'form' ? this.data.labelBottomNao : 'Fechar';
  }

  closeModal() {
    this.dialogRef.close();
  }

  /* ---------- 1. cria a tarefa ---------- */
  onProcessar() {
    if (this.estado !== 'form') return;

    const escopo = this.formulario.value.escopo;
    const parametros = {
      ...this.data.parametros,
      pagina: escopo === 'T' ? 0 : this.data.pagina, // 0 = ignora a paginação
      tamPagina: this.data.tamPagina,
      contador: 'N',
    };

    this.estado = 'processando';
    this.tentativa = 0;
    this.mensagem = 'Solicitando o relatório...';

    this.inscricaoTarefa = this.tarefaSrv
      .incluir(this.data.sigla, parametros)
      .subscribe({
        next: (tarefa: TarefaModel) => {
          this.tarefa = tarefa;
          this.acompanhar(tarefa.id);
        },
        error: (error: any) => this.falhar(`Não foi possível solicitar o relatório. ${messageError(error)}`),
      });
  }

  /* ---------- 2. polling curto ---------- */
  private acompanhar(id: number) {
    this.mensagem = 'Gerando o relatório...';

    this.inscricaoPolling = timer(POLLING_INICIO_MS, POLLING_INTERVALO_MS)
      .pipe(
        take(POLLING_TENTATIVAS),
        tap((n) => {
          this.tentativa = n + 1;
          this.mensagem = `Gerando o relatório... (${this.tentativa}/${POLLING_TENTATIVAS})`;
        }),
        // switchMap: se uma resposta demorar, a próxima consulta não empilha
        switchMap(() => this.tarefaSrv.getTarefa(id, true)),
        // para no primeiro resultado definitivo; se acabarem as tentativas emite null
        first(
          (t) => t.status !== TarefaStatus.PENDENTE && t.status !== TarefaStatus.PROCESSANDO,
          null,
        ),
      )
      .subscribe({
        next: (t: TarefaModel | null) => {
          if (t === null) return this.demorando();
          this.tarefa = t;
          this.resultado(t);
        },
        error: (error: any) => this.falhar(`Falha ao consultar o relatório. ${messageError(error)}`),
      });
  }

  private resultado(t: TarefaModel) {
    switch (t.status) {
      case TarefaStatus.CONCLUIDA:
        return this.finalizar(t);
      case TarefaStatus.SEM_DADOS:
        return this.falhar('A consulta não retornou resultados.');
      default:
        return this.falhar(`Falha ao gerar o relatório. ${t.mensagem}`);
    }
  }

  private demorando() {
    this.estado = 'demorando';
    this.mensagem =
      'O relatório está demorando mais que o esperado. Ele continua sendo gerado em segundo plano e ficará disponível na tela de acompanhamento das tarefas.';
  }

  /* ---------- 3. entrega (e-mail ou download) ---------- */
  private finalizar(t: TarefaModel) {
    this.estado = 'finalizando';

    if (this.data.finalizacao === 'email') {
      this.mensagem = 'Enviando o e-mail...';
      this.inscricaoFinal = this.tarefaSrv.enviarEmail(t.id).subscribe({
        next: (resp) => {
          this.appSnackBar.openSuccessSnackBar(resp.message || 'E-Mail enviado com sucesso!', 'OK');
          this.closeModal();
        },
        error: (error: any) => this.falhar(`Falha ao enviar o e-mail. ${messageError(error)}`),
      });
      return;
    }

    this.mensagem = 'Baixando o arquivo...';
    this.inscricaoFinal = this.tarefaSrv.download(t.id).subscribe({
      next: (blob: Blob) => {
        salvarArquivo(blob, t.name_file);
        this.appSnackBar.openSuccessSnackBar('Arquivo gerado com sucesso!', 'OK');
        this.closeModal();
      },
      // em download a resposta de erro é um Blob, então a mensagem do servidor não é lida aqui
      error: (error: any) =>
        this.falhar(
          error?.status === 410
            ? 'O arquivo expirou. Gere o relatório novamente.'
            : 'Falha ao baixar o arquivo.',
        ),
    });
  }

  private falhar(mensagem: string) {
    this.estado = 'erro';
    this.mensagem = mensagem;
    this.appSnackBar.openFailureSnackBar(mensagem, 'OK');
  }
}
