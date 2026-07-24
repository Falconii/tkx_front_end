import { DetplanilhaService } from './../../../services/detPlanilha.service';
import { Component, Inject } from '@angular/core';
import { ParametroModel } from '../../../models/parametro-model';
import { Subscription } from 'rxjs';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
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
import { EditDetalheDialogData } from '../edit-detalhe-dialog/edit-detalhe-dialog-data';
import { EditDetalheDialogComponent } from '../edit-detalhe-dialog/edit-detalhe-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

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
      private deleteDialog: MatDialog,
    ) {}

      ngOnInit(): void {

      }

      ngOnDestroy() {
        this.inscricaoDetalhe?.unsubscribe();
      }


      escolha(opcao: number, i: number, detalhe?: DetplanilhaModel) {
         if (detalhe == null){
          return
         } else {
           if (opcao == CadastroAcoes.Consulta) {
             this.openDetalheDialog(opcao, i, detalhe);
           }
           if (opcao == CadastroAcoes.Edicao){
            this.openDetalheDialog(opcao,i,detalhe);
           }
           if (opcao == CadastroAcoes.Exclusao) {
             this.openDeletePlanilha(opcao, i, detalhe);
           }

         }
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


  openDeletePlanilha(opcao: CadastroAcoes, indice: number, detalhe: DetplanilhaModel) {
      const dialogRef = this.deleteDialog.open(ConfirmDialogComponent, {
        width: '380px',
        data: {
          title: 'Excluir Planilha',
          message: `${detalhe.nome}`,
          confirmText: 'Sim, excluir',
          cancelText: 'Cancelar',
          icone: 'play_circle_filled',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
         // this.deletePlanilha(planilha, indice);
        }
      });
    }


  openDetalheDialog(
    opcao: CadastroAcoes = CadastroAcoes.Consulta,
    i: number,
    detPlanilha: DetplanilhaModel,
  ): void {
    const data: EditDetalheDialogData = {
      idAcao: opcao,
      result: false,
      detPlanilha: detPlanilha,
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'EditDetalheDialogComponent';


    // FULLSCREEN REAL
    dialogConfig.width = '100vw';
    dialogConfig.height = '100vh';
    dialogConfig.maxWidth = '100vw';

    dialogConfig.data = data;

    this.editDetalheDialog
      .open(EditDetalheDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((result: EditDetalheDialogData | null) => {
        if (result?.result) {

          this.appSnackBar.openSuccessSnackBar("RETORNO OK", "ok");

        }
      });
  }



}
