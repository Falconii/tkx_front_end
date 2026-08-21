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
import { ParametroCheckFile01 } from '../../../parametros/parametro-check01';
import { CheckFileModel } from '../../../models/check_file-model';

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

  status:number = 0;
  /*
    1- Não iniciado
    2- upload
    3- Aguardndo processamnento
    4- fim
      */

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
    if (this.status == 1 || this.status == 2) {
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

    this.status = 1;

    let key: number = 0;

    let id_evento = 0;

    key = parseInt(this.formulario.value.id_evento);

    if (isNaN(key)) {
      this.appSnackBar.openFailureSnackBar('Código Do Evento Inválido!', 'OK');
      return;
    } else {
      id_evento = key;
    }

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
            this.status = 2;
            this.checkPlanilha(
              id_evento,
              this.selectedFile.name,
            );
          }
        }
      },
      error: (error) => {
        this.status = 3;
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

  /* rotina antiga
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
            this.status = 3;
            this.data.processar = true;
          }
        },

        error: (err) => {
          if (this.inscricaoStatus) {
            this.inscricaoStatus.unsubscribe();
          }
          this.status = 3;
        },

        complete: () => {
          this.appSnackBar.openFailureSnackBar(
            'Processando Terminou Com Falha!',
            'OK',
          );
          this.status = 3;
        },
      });
  }
      */

  checkPlanilha(id_evento: number, fileName: string) {

    console.log("checkFile: ", fileName);

    let par = new ParametroCheckFile01();

    par.id_evento  = id_evento;

    par.fileName   = fileName;

    let tentativa  = 0;

    par.maxTentativas = 40;

    const interval = setInterval(() => {

      tentativa++;

      par.tentativa = tentativa;

      this.tentativaAtual = tentativa;

      this.tentativaAtual = par.tentativa;

      try {
        this.inscricaoStatus = this.importacaoSrv
          .checkFile(par)
          .subscribe({
            next: (ret: CheckFileModel) => {
              if (ret.status === 'ready') {
                this.status = 2;
                clearInterval(interval);
                this.total_linhas = ret.total_linhas;
                this.total_linhas_erro = ret.total_linhas_erro;
                this.selectedFile = null;
                this.formulario.patchValue({ caminho: '' });
                this.inscricaoStatus.unsubscribe();
                this.status = 3;
                this.data.processar = true;
              }
              if (ret.status === 'failed') {
                this.showSpin = false;
                this.status = 2;
                clearInterval(interval);
                this.appSnackBar.openFailureSnackBar("Falha ao gerar o arquivo!", "OK");
              }
              if (ret.status === 'exceeded') {
                this.showSpin = false;
                this.status = 2;
                clearInterval(interval);
                this.appSnackBar.openFailureSnackBar("Excedido O Nro De Tentativas. Peças Novamente!", "OK");
              }

            },
            error: (error: any) => {
              this.showSpin = false;
              this.status = 2;
              this.appSnackBar.openFailureSnackBar(`Erro:${error.message}`, "OK");
              clearInterval(interval);
            },
          });
      }
      catch (error) {
        this.showSpin = false;
        this.status = 2;
        this.appSnackBar.openFailureSnackBar("Erro Na Validação Do Arquivo!", "OK");
        clearInterval(interval);
      }

      if (tentativa >= par.maxTentativas) {
        this.showSpin = false;
        this.status = 2;
        clearInterval(interval);
        this.appSnackBar.openFailureSnackBar("Excedido O Nro De Tentativas. Peças Novamente!", "OK");
      }

    }, 5000);
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
    if (this.status == 1) {
       return `Enviando... ${this.progress}%`;
    } else {
      return `UPLOAD Completo, Aguardando Processamento...(${this.tentativaAtual+1}/40) `;
    }
  }


  getMessageStatus(): string {
    if (this.status == 1) {
      return 'Enviando Planilha';
    } else if (this.status == 2) {
      return 'Aguardando Processamento';
    } else {
      return '';
    }
  }

  showUploadButton(): boolean {
    return(!(this.status == 1) && !(this.status == 2));
  }
}
