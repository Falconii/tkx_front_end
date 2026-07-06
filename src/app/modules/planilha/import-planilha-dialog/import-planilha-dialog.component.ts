import { EventoService } from './../../../services/evento.service';
import { Component, Inject } from '@angular/core';
import { Importplanilhadata } from './importplanilha-data';
import { finalize, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoModel } from '../../../models/evento-model';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { messageError } from '../../../shared/classes/util';
import { CabplanilhaService } from '../../../services/cabplanilha.service';
import { HttpEventType } from '@angular/common/http';
import { ImportacaoService } from '../../../services/importacao.service';
import { CabplanilhaComplementarService } from '../../../services/cabplanilhaComplementar.service';

@Component({
  selector: 'app-import-planilha-dialog',
  templateUrl: './import-planilha-dialog.component.html',
  styleUrl: './import-planilha-dialog.component.css',
})
export class ImportPlanilhaDialogComponent {
  acao: string = 'Sem Definição';
  inscricaoEventos!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoStatus!: Subscription;

  labelCadastro: string = '';

  formulario: FormGroup;

  selectedFile: File | null = null;

  lsEventos: EventoModel[] = [];

  progress: number = 0;

  linhas_processadas: number = 0;

  total_linhas: number = 0;

  total_linhas_erro: number = 0;

  emProcessamento: boolean = false;

  foiProcessada: boolean = false;

  showSpin: boolean = false;

  tentativaAtual: number = 0;

  constructor(
    private eventoSrv: EventoService,
    private globalService: GlobalService,
    private importacaoSrv: ImportacaoService,
    private cabPlanilhaSrv: CabplanilhaComplementarService,
    @Inject(MAT_DIALOG_DATA) public data: Importplanilhadata,
    private dialogRef: MatDialogRef<ImportPlanilhaDialogComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private appSnackBar: AppSnackbar,
  ) {
    this.globalService.showSpin$.subscribe((show) => {
      this.showSpin = show;
    });
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
    this.inscricaoStatus?.unsubscribe();
  }

  getEventos() {
    let par: ParametroEvento01 = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.status = '1';

    ((par.contador = 'N'), (par.tamPagina = 0));

    this.inscricaoEventos = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: EventoModel[]) => {
          this.lsEventos = data;
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
            return;
          }
          if (error.status && error.status == 409) {
            this.lsEventos = [];
          } else {
            this.lsEventos = [];
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Participantes ${messageError(error)}`,
              'OK',
            );
          }
        },
      });
  }

  setValue(path: string = '') {
    this.formulario.setValue({
      id_evento: this.lsEventos[0].id,
      caminho: path,
    });
  }

  setNoParam() {
    this.formulario.setValue({
      id_evento: '',
      caminho: '',
    });
  }

  onUpload() {
    if (this.formulario.valid) {
      this.upload();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK',
      );
    }
  }

  closeModal() {
    if (this.emProcessamento) {
       this.appSnackBar.openWarningnackBar(
         'Processamento Em Andamento, Aguarde Terminar Para Fechar!',
         'OK',
       );
       return;
    }
    this.dialogRef.close(this.data);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.formulario.patchValue({ caminho: this.selectedFile?.name });
  }

  onExecucao() {
    this.onUpload();
  }

  onCancelar() {}

  upload() {
    if (!this.selectedFile) return;

    this.foiProcessada = false;

    let key: number = 0;

    let id_evento = 0;

    key = parseInt(this.formulario.value.id_evento);

    if (isNaN(key)) {
      this.appSnackBar.openFailureSnackBar('Código Do Evento Inválido!', 'OK');
      return;
    } else {
      id_evento = key;
    }

    this.emProcessamento = true;


    this.importacaoSrv.uploadPlanilha(id_evento, this.selectedFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.progress = 0;
          this.appSnackBar.openSuccessSnackBar(
            'Planilha Importada com Sucesso!',
            'OK',
          );
          if (this.selectedFile?.name) {
            this.verificaStatus(
              this.globalService.getEmpresa().id,
              id_evento,
              this.selectedFile.name,
            );
          }
        }
      },
      error: (error) => {
        this.emProcessamento = false;
        this.foiProcessada = true;
        this.appSnackBar.openFailureSnackBar(
          `Erro No UpLoad ${error.error?.tabela ?? ''} - ${error.error?.erro ?? ''} - ${error.error?.message ?? ''}`,
          'OK',
        );
        this.progress = 0;
        this.selectedFile = null;
        this.formulario.patchValue({ caminho: '' });
      },
    });
  }

  verificaStatus(id_empresa: number, id_evento: number, fileName: string) {
    this.inscricaoStatus = this.cabPlanilhaSrv
      .verificarStatus(id_empresa, id_evento, fileName)
      .subscribe({
        next: (ret) => {

          this.tentativaAtual = ret.tentativa;
          if (ret.lista.length > 0) {
            this.total_linhas = ret.lista[0].total_linhas;
            this.total_linhas_erro = ret.lista[0].total_linhas_erro;
            this.selectedFile = null;
            this.formulario.patchValue({ caminho: '' });
            this.inscricaoStatus.unsubscribe();
            this.emProcessamento = false;
            this.foiProcessada = true;
            this.data.processar = true;
          }
        },

        error: (err) => {
          console.error('Erro no polling:', err);
          if (this.inscricaoStatus) {
            this.inscricaoStatus.unsubscribe();
          }
          this.emProcessamento = false;
          this.foiProcessada = false;
        },

        complete: () => {
          this.appSnackBar.openFailureSnackBar(
            'Processando Terminou Com Falha!',
            'OK',
          );
          this.emProcessamento = false;
          this.foiProcessada = true;
        },
      });
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

  getMessageProgress(): string {
    if (this.progress < 100) {
       return `Enviando... ${this.progress}%`;
    } else {
      return `Planilha Enviada, Aguardando Processamento...(${this.tentativaAtual+1}/40) `;
    }
  }


  getMessageStatus(): string {
    if (this.emProcessamento) {
      return 'Processando...';
    } else if (this.foiProcessada) {
      return 'Processamento Concluído!';
    } else {
      return '';
    }
  }

  showUploadButton(): boolean {
    return !this.emProcessamento && !this.foiProcessada;
  }
}
