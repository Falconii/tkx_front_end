import { ControlePaginas } from './../../../shared/classes/controle-paginas';
import { Component, Inject } from '@angular/core';
import { DetplanilhaModel } from '../../../models/detPlanilha-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ParametroModel } from '../../../models/parametro-model';
import { GlobalService } from '../../../services/global.service';
import { EditDetalheDialogData } from './edit-detalhe-dialog-data';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroDetplanilha01 } from '../../../parametros/parametro-detPlanilha01';
import { DetplanilhaService } from '../../../services/detPlanilha.service';
import { AtualizaParametroDetplanilha01 } from '../../../shared/classes/atualiza-parametro-detplanilha01';

@Component({
  selector: 'app-edit-detalhe-dialog',
  templateUrl: './edit-detalhe-dialog.component.html',
  styleUrl: './edit-detalhe-dialog.component.css'
})
export class EditDetalheDialogComponent {

    erro: any;

    acao: string = 'Sem Definição';

    idAcao: number = CadastroAcoes.None

    readOnly: boolean = true;

    inscricaoDetatalhes!: Subscription;

    labelCadastro: string = '';

    lsDetalhes: DetplanilhaModel[] = [];

    parametro:ParametroModel = new ParametroModel();

    hide:boolean = true;

    controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

    tamPagina: number = 50;

    constructor(
        private globalService: GlobalService,
        private detPlanilhaSrv:DetplanilhaService,
        private appSnackBar: AppSnackbar,
        @Inject(MAT_DIALOG_DATA) public data: EditDetalheDialogData,
      private dialogRef: MatDialogRef<EditDetalheDialogComponent>,
      ) {

      }
      ngOnInit(): void {
      }

      ngOnDestroy(): void {
        this.inscricaoDetatalhes?.unsubscribe();
      }


      getDetalhes(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {

        let par = new ParametroDetplanilha01();

        par.id_empresa = this.globalService.getEmpresa().id;

        par = AtualizaParametroDetplanilha01(par, this.parametro.getParametro());

        if (tipoOperacao == TipoOperacao.Contador) {
          par.contador = 'S';
        } else {
          par.pagina = this.controlePaginas.getPaginalAtual();
          par.tamPagina = this.controlePaginas.getTamPagina();
        }

        console.log('Paramentros de Consulta:', par);
        this.inscricaoDetatalhes = this.detPlanilhaSrv
          .getDetplanilhasParametro_01(par)
          .subscribe({
            next: (data: any) => {
              if (tipoOperacao == TipoOperacao.Pesquisa) {
                this.lsDetalhes = data;
                console.log('DetPlanilhas Encontrados:', this.lsDetalhes);
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

       escolha(opcao: number, indice: number, planilha?: DetplanilhaModel) {
          if (planilha == null) {

          } else {

          }
        }


      onCancel(){
          this.closeModal();
      }

      onChangeParametros(param:ParametroModel){
          this.parametro = param;
          console.log('Paramentro de Pesquisa', this.parametro);
          this.getDetalhes(TipoOperacao.Contador);
        }


        onChangeHide(hide: boolean) {
          this.hide = hide;
        }

        closeModal() {
          this.data.result = true;
          this.dialogRef.close(this.data);
        }

}
