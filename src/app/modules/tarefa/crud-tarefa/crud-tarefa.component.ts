import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, switchMap, timer } from 'rxjs';
import { ParametroModel } from '../../../models/parametro-model';
import { TarefaModel, TarefaStatus } from '../../../models/tarefa-model';
import { ParametroTarefa01 } from '../../../parametros/parametro-tarefa01';
import { TarefaService } from '../../../services/tarefa.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { AtualizaParametroTarefa01 } from '../../../shared/classes/atualiza-parametro-tarefa01';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { salvarArquivo } from '../../../shared/classes/salvar-arquivo';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { MensagensBotoes, messageError } from '../../../shared/classes/util';

/** enquanto houver tarefa na fila/processando, a lista se atualiza sozinha neste intervalo */
const ATUALIZACAO_AUTOMATICA_MS = 3000;

@Component({
  selector: 'app-crud-tarefa',
  templateUrl: './crud-tarefa.component.html',
  styleUrl: './crud-tarefa.component.scss',
})
export class CrudTarefaComponent implements OnDestroy {
  inscricaoTarefa!: Subscription;
  inscricaoAuto!: Subscription;
  inscricaoAcao!: Subscription;

  tarefas: TarefaModel[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  parametro: ParametroModel = new ParametroModel();

  hide: boolean = false;

  /** id da tarefa com download/e-mail em andamento (desabilita os botões dela) */
  ocupadoId: number = 0;

  constructor(
    private tarefaSrv: TarefaService,
    private router: Router,
    private appSnackBar: AppSnackbar,
  ) {}

  ngOnDestroy() {
    this.inscricaoTarefa?.unsubscribe();
    this.inscricaoAuto?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  getTexto() {
    return MensagensBotoes;
  }

  onHome() {
    this.router.navigate(['']);
  }

  /* ---------- pesquisa ---------- */
  private montarParametros(tipoOperacao: TipoOperacao): ParametroTarefa01 {
    let par = new ParametroTarefa01();
    par = AtualizaParametroTarefa01(par, this.parametro.getParametro());

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }
    return par;
  }

  getTarefas(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    this.inscricaoAuto?.unsubscribe(); // uma consulta manual cancela a atualização automática pendente

    this.inscricaoTarefa = this.tarefaSrv
      .pesquisar(this.montarParametros(tipoOperacao))
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.tarefas = data;
            this.agendarAtualizacao();
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total,
            );
            this.getTarefas();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.tarefas = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        },
      });
  }

  onChangePage() {
    this.getTarefas();
  }

  onChangeHide(hide: boolean) {
    this.hide = hide;
  }

  onChangeParametros(param: ParametroModel) {
    this.parametro = param;
    this.getTarefas(TipoOperacao.Contador);
  }

  /* ---------- atualização automática ---------- */
  private emAndamento(): boolean {
    return this.tarefas.some(
      (t) => t.status === TarefaStatus.PENDENTE || t.status === TarefaStatus.PROCESSANDO,
    );
  }

  /**
   * Enquanto houver tarefa na fila ou processando, consulta de novo a página atual.
   * Só agenda a próxima depois de receber a resposta (nunca empilha chamadas) e sem
   * piscar o spinner global.
   */
  private agendarAtualizacao() {
    this.inscricaoAuto?.unsubscribe();
    if (!this.emAndamento()) return;

    this.inscricaoAuto = timer(ATUALIZACAO_AUTOMATICA_MS)
      .pipe(
        switchMap(() =>
          this.tarefaSrv.pesquisar(this.montarParametros(TipoOperacao.Pesquisa), true),
        ),
      )
      .subscribe({
        next: (data: TarefaModel[]) => {
          this.tarefas = data;
          this.agendarAtualizacao();
        },
        error: () => {}, // falha momentânea: o botão "Atualizar" continua disponível
      });
  }

  /* ---------- situação / ações ---------- */
  expirada(t: TarefaModel): boolean {
    return t.mensagem === 'Arquivo expirado';
  }

  /** download e e-mail só existem para relatório concluído cujo arquivo ainda não expirou */
  disponivel(t: TarefaModel): boolean {
    return t.status === TarefaStatus.CONCLUIDA && !this.expirada(t);
  }

  classeSituacao(t: TarefaModel): string {
    return `situacao situacao-${this.expirada(t) ? 'expirada' : t.status}`;
  }

  /** observação exibida na linha: motivo da falha, "sem resultados" ou arquivo expirado */
  observacao(t: TarefaModel): string {
    if (t.status === TarefaStatus.SEM_DADOS) return 'A consulta não retornou resultados.';
    return t.mensagem;
  }

  /** 'YYYY-MM-DD HH:MM:SS' -> 'DD/MM/YYYY HH:MM' */
  formataData(valor: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(valor ?? '');
    return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : (valor ?? '');
  }

  baixar(t: TarefaModel) {
    if (this.ocupadoId) return;
    this.ocupadoId = t.id;
    this.inscricaoAcao = this.tarefaSrv.download(t.id).subscribe({
      next: (blob: Blob) => {
        salvarArquivo(blob, t.name_file);
        this.ocupadoId = 0;
      },
      // em download a resposta de erro é um Blob: a mensagem do servidor não é legível aqui
      error: (error: any) => {
        this.ocupadoId = 0;
        const expirou = error?.status === 410;
        this.appSnackBar.openFailureSnackBar(
          expirou ? 'O arquivo expirou. Gere o relatório novamente.' : 'Falha ao baixar o arquivo.',
          'OK',
        );
        if (expirou) this.getTarefas(); // a lista passa a mostrar "Arquivo expirado"
      },
    });
  }

  enviarEmail(t: TarefaModel) {
    if (this.ocupadoId) return;
    this.ocupadoId = t.id;
    this.inscricaoAcao = this.tarefaSrv.enviarEmail(t.id).subscribe({
      next: (resp) => {
        this.ocupadoId = 0;
        this.appSnackBar.openSuccessSnackBar(resp.message || 'E-Mail enviado com sucesso!', 'OK');
      },
      error: (error: any) => {
        this.ocupadoId = 0;
        this.appSnackBar.openFailureSnackBar(`Falha ao enviar o e-mail. ${messageError(error)}`, 'OK');
        if (error?.status === 410) this.getTarefas();
      },
    });
  }
}
