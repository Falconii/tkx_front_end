import { DetplanilhaService } from './../../../services/detPlanilha.service';
import { Component, Inject } from '@angular/core';
import { ParametroModel } from '../../../models/parametro-model';
import { Subscription } from 'rxjs';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { DetplanilhaModel } from '../../../models/detPlanilha-model';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroDetplanilha01 } from '../../../parametros/parametro-detPlanilha01';
import { MensagensBotoes } from '../../../shared/classes/util';
import { CrudDetalheDialogData } from './crud-detalhe-dialog-data';
import { AtualizaParametroDetplanilha01 } from '../../../shared/classes/atualiza-parametro-detplanilha01';

@Component({
  selector: 'app-crud-detalhe-dialog',
  templateUrl: './crud-detalhe-dialog.component.html',
  styleUrl: './crud-detalhe-dialog.component.css'
})
export class CrudDetalheDialogComponent {

    inscricaoDetalhe!: Subscription;

    controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

    tamPagina: number = 50;

    parametro: ParametroModel = new ParametroModel();

    lsDetalhes:DetplanilhaModel[] = [];

    hide: boolean = false;


    constructor(
      private globalService: GlobalService,
      private detplanilhaSrv: DetplanilhaService,
      private route: ActivatedRoute,
      private router: Router,
      private appSnackBar: AppSnackbar,
      private editDetalheDialog: MatDialog,
       @Inject(MAT_DIALOG_DATA) public data: CrudDetalheDialogData,
      private dialogRef: MatDialogRef<CrudDetalheDialogComponent>,
    ) {}

      ngOnInit(): void {

      }

      ngOnDestroy() {
        this.inscricaoDetalhe?.unsubscribe();
      }


      escolha(opcao: number, i: number, detalhe?: DetplanilhaModel) {
        //this.openParticipanteDialog(opcao, i, participante);
      }

      onHome() {
        this.router.navigate(['']);
      }

      getAcoes() {
        return CadastroAcoes;
      }

      getDetalhes(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {

        let par = new ParametroDetplanilha01();

        par.id_empresa = this.globalService.getEmpresa().id;

        par.id_cabec = this.data.cabPlanilha.id;

        par.id_evento = this.data.cabPlanilha.id_evento;

        par = AtualizaParametroDetplanilha01(par, this.parametro.getParametro());

        if (tipoOperacao == TipoOperacao.Contador) {
          par.contador = 'S';
        } else {
          par.pagina = this.controlePaginas.getPaginalAtual();
          par.tamPagina = this.controlePaginas.getTamPagina();
        }

        console.log('Paramentros de Consulta 2:', par);
        this.inscricaoDetalhe = this.detplanilhaSrv
          .getDetplanilhasParametro_01(par)
          .subscribe({            next: (data: any) => {
              if (tipoOperacao == TipoOperacao.Pesquisa) {
                this.lsDetalhes = data;
                console.log('Detalhes:', this.lsDetalhes);
              } else {
                this.controlePaginas = new ControlePaginas(
                  this.tamPagina,
                  data.total == 0 ? 1 : data.total,
                );
                this.getDetalhes();
              }
            },
            error: (error: any) => {
              console.log(error);
              this.lsDetalhes = [];
              this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
            },
          });
      }

      getTexto() {
        return MensagensBotoes;
      }

      onChangePage() {
        this.getDetalhes();
      }

      onChangeHide(hide: boolean) {
        this.hide = hide;
      }

      onChangeParametros(param: ParametroModel) {
        this.parametro = param;
        console.log('Paramentro de Pesquisa', this.parametro);
        this.getDetalhes(TipoOperacao.Contador);
      }

      onCancel() {
        this.closeModal();
      }


      closeModal() {
        this.data.result = true;
        this.dialogRef.close(this.data);
      }

      openEditDetalheDialog(
        opcao: CadastroAcoes = CadastroAcoes.Consulta,
        i: number,
        detalhe?: DetplanilhaModel,
      ): void {

       /*  const data: ParticipanteV2DialogData = {
          indice: i,
          opcao,
          processar: false,
          participante: paticipante ?? {
            ...new Participantev2Model(),
            id_empresa: this.globalService.getEmpresa().id,
          },
        };

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id = 'participantev2-dialog-fullscreen';

        // FULLSCREEN REAL
        dialogConfig.width = '100vw';
        dialogConfig.height = '100vh';
        dialogConfig.maxWidth = '100vw';
        dialogConfig.panelClass = 'fullscreen-dialog';

        dialogConfig.data = data;

        this.participanteDialog
          .open(Participantev2DialogComponent, dialogConfig)
          .beforeClosed()
          .subscribe((result: ParticipanteV2DialogData | null) => {
            if (result?.processar) {
              switch (opcao) {
                case CadastroAcoes.Inclusao:
                  this.participantes.push(result.participante!);
                  break;

                case CadastroAcoes.Edicao:
                  if (i >= 0)
                    this.participantes[result.indice] = result.participante!;
                  break;

                case CadastroAcoes.Exclusao:
                  this.participantes.splice(result.indice, 1);
                  break;
              }
            }
          });
          */
       }




}
