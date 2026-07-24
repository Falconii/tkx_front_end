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
import { DetplanilhaService } from '../../../services/detPlanilha.service';
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

    inscricaoDetatalhe!: Subscription;

    labelCadastro: string = '';

    constructor(
        private globalService: GlobalService,
        private detPlanilhaSrv:DetplanilhaService,
        private appSnackBar: AppSnackbar,
        @Inject(MAT_DIALOG_DATA) public data: EditDetalheDialogData,
      private dialogRef: MatDialogRef<EditDetalheDialogComponent>,
      ) {

      }
      ngOnInit(): void {
        this.getDetalhe();
      }

      ngOnDestroy(): void {
        this.inscricaoDetatalhe?.unsubscribe();
      }


      getDetalhe() {


        this.inscricaoDetatalhe = this.detPlanilhaSrv
          .getDetplanilha(this.data.detPlanilha.id_empresa, this.data.detPlanilha.id_evento, this.data.detPlanilha.id_cabec, this.data.detPlanilha.nro_peito)
          .subscribe({
            next: (data: any) => {
                 this.data.detPlanilha = data;
            },
            error: (error: any) => {
               this.appSnackBar.openFailureSnackBar("Participante Não Encontrado!","OK");

              this.data.result = false;

              this.closeModal();
            },
          });
      }

      onCancel(){
          this.data.result = false;
          this.closeModal();
      }

      closeModal() {
          this.dialogRef.close(this.data);
        }

}
