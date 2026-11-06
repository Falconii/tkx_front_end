import { EventoService } from './../../../services/evento.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Importplanilhadata } from './importplanilha-data';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventoModel } from '../../../models/evento-model';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { messageError } from '../../../shared/classes/util';
import { HttpEventType } from '@angular/common/http';
import { ImportacaoService } from '../../../services/importacao.service';

/** estados do diálogo */
const ESCOLHENDO = 0;
const ENVIANDO = 1;
const CONCLUIDO = 2;
const FALHOU = 3;

@Component({
  selector: 'app-import-planilha-dialog',
  templateUrl: './import-planilha-dialog.component.html',
  styleUrl: './import-planilha-dialog.component.css',
})
export class ImportPlanilhaDialogComponent implements OnInit, OnDestroy {
  inscricaoEventos!: Subscription;
  inscricaoAcao!: Subscription;

  formulario: FormGroup;

  selectedFile: File | null = null;

  lsEventos: EventoModel[] = [];

  /** 0 = escolhendo o arquivo | 1 = enviando/gravando | 2 = concluído | 3 = falhou */
  status: number = ESCOLHENDO;

  progress: number = 0;

  /** resultado devolvido pelo servidor ao final da carga */
  resumo = {
    total_linhas: 0,
    linhas_ok: 0,
    total_linhas_erro: 0,
    peitos_gerados: 0,
    linhas_ignoradas: 0,
    linhas_com_aviso: 0,
  };

  mensagemErro: string = '';
  detalhesErro: string[] = [];

  constructor(
    private eventoSrv: EventoService,
    private globalService: GlobalService,
    private importacaoSrv: ImportacaoService,
    @Inject(MAT_DIALOG_DATA) public data: Importplanilhadata,
    private dialogRef: MatDialogRef<ImportPlanilhaDialogComponent>,
    private formBuilder: FormBuilder,
    private appSnackBar: AppSnackbar,
  ) {
    this.formulario = formBuilder.group({
      id_evento: [{ value: '' }, [Validators.required]],
      caminho: [{ value: '' }, [Validators.required]],
    });
    this.setNoParam();
  }

  ngOnInit(): void {
    this.getEventos();
  }

  ngOnDestroy(): void {
    this.inscricaoEventos?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  /** só eventos liberados para importação (situação 1) */
  getEventos() {
    let par: ParametroEvento01 = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.status = '1';

    par.contador = 'N';
    par.tamPagina = 0;

    this.inscricaoEventos = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: EventoModel[]) => {
          this.lsEventos = data;
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.appSnackBar.openFailureSnackBar('Ação Não Autorizada', 'OK');
            return;
          }
          this.lsEventos = [];
          if (!(error.status && error.status == 409)) {
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Eventos ${messageError(error)}`,
              'OK',
            );
          }
        },
      });
  }

  setNoParam() {
    this.formulario.setValue({
      id_evento: '',
      caminho: '',
    });
  }

  get enviando(): boolean {
    return this.status === ENVIANDO;
  }

  get concluido(): boolean {
    return this.status === CONCLUIDO;
  }

  get falhou(): boolean {
    return this.status === FALHOU;
  }

  onUpload() {
    if (this.formulario.valid) {
      this.upload();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openFailureSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK',
      );
    }
  }

  /** só não deixa fechar enquanto o envio está em andamento */
  closeModal() {
    if (this.enviando) {
      this.appSnackBar.openWarningnackBar(
        'Importação Em Andamento, Aguarde Terminar Para Fechar!',
        'OK',
      );
      return;
    }
    this.dialogRef.close(this.data);
  }

  onCancelar() {
    this.closeModal();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.formulario.patchValue({ caminho: this.selectedFile?.name });
  }

  /** volta para a escolha do arquivo depois de uma falha */
  tentarNovamente() {
    this.status = ESCOLHENDO;
    this.mensagemErro = '';
    this.detalhesErro = [];
    this.progress = 0;
    this.selectedFile = null;
    this.formulario.patchValue({ caminho: '' });
  }

  upload() {
    if (!this.selectedFile) return;

    const id_evento = parseInt(this.formulario.value.id_evento, 10);
    if (isNaN(id_evento)) {
      this.appSnackBar.openFailureSnackBar('Código Do Evento Inválido!', 'OK');
      return;
    }

    this.status = ENVIANDO;
    this.progress = 0;

    // A carga termina na própria resposta do upload (ou não grava nada): não há mais o que consultar depois.
    this.inscricaoAcao = this.importacaoSrv
      .uploadPlanilha(id_evento, this.selectedFile)
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / (event.total || 1));
          } else if (event.type === HttpEventType.Response) {
            const r = event.body ?? {};
            this.resumo = {
              total_linhas: r.total_linhas ?? 0,
              linhas_ok: r.linhas_ok ?? 0,
              total_linhas_erro: r.total_linhas_erro ?? 0,
              peitos_gerados: r.peitos_gerados ?? 0,
              linhas_ignoradas: r.linhas_ignoradas ?? 0,
              linhas_com_aviso: r.linhas_com_aviso ?? 0,
            };
            this.status = CONCLUIDO;
            this.data.processar = true;
            this.appSnackBar.openSuccessSnackBar(
              'Planilha Importada com Sucesso!',
              'OK',
            );
          }
        },
        error: (error: any) => {
          this.status = FALHOU;
          this.mensagemErro = error.error?.message ?? error.message ?? 'Erro desconhecido.';
          this.detalhesErro = Array.isArray(error.error?.detalhes) ? error.error.detalhes : [];
          this.appSnackBar.openFailureSnackBar(`Erro No UpLoad: ${this.mensagemErro}`, 'OK');
        },
      });
  }

  getMessageProgress(): string {
    return this.progress < 100
      ? `Enviando... ${this.progress}%`
      : `Gravando as linhas da planilha...Aguarde!`;
  }

  NoValidtouchedOrDirty(campo: string): boolean {
    if (
      !this.formulario.get(campo)?.valid &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    ) {
      return true;
    }
    return false;
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.['message'];
  }
}
