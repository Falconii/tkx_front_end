import { EventoService } from './../../../services/evento.service';
import { Component, Inject } from '@angular/core';
import { Importplanilhadata } from './importplanilha-data';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';

@Component({
  selector: 'app-import-planilha-dialog',
  templateUrl: './import-planilha-dialog.component.html',
  styleUrl: './import-planilha-dialog.component.css',
})
export class ImportPlanilhaDialogComponent {
  acao: string = 'Sem Definição';
  inscricaoEventos!: Subscription;
  inscricaoAcao!: Subscription;

  labelCadastro: string = '';

  constructor(
    private eventoSrv: EventoService,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: Importplanilhadata,
    private dialogRef: MatDialogRef<ImportPlanilhaDialogComponent>
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoEventos?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  actionFunction() {}

  closeModal() {
    //cd tk this.data.processar = true;
    this.dialogRef.close(this.data);
  }
}
