import { Component, Inject } from '@angular/core';
import { EntregaDialogData } from './entrega-dialog-data';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';

@Component({
  selector: 'app-entrega-dialog',
  templateUrl: './entrega-dialog.component.html',
  styleUrl: './entrega-dialog.component.css'
})
export class EntregaDialogComponent {
 formulario: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private appSnackBar: AppSnackbar,
    public dialogRef: MatDialogRef<EntregaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntregaDialogData){
      this.formulario = formBuilder.group({
      tam_camiseta :[{ value: '' }],
      nome_retirada: [{ value: '' }],
      });
    }

  ngOnInit() {
    this.setValue();
    }

  setValue() {
   this.formulario.setValue({
     tam_camiseta: this.data.dado.tam_camiseta,
     nome_retirada:this.data.dado.nome_retirada,
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
   return "";
 }

 hasValue(campo: string): boolean {
   if (this.formulario.get(campo)?.value == "") {
     return false;
   }
   return true;
}

closeModal() {
    this.dialogRef.close();
  }

  onProcessar(){
    if (this.formulario.valid) {
      this.data.dado.tam_camiseta       = this.formulario.value.tam_camiseta;
      this.data.dado.nome_retirada      = this.formulario.value.nome_retirada;
      this.data.processar = true;
      this.closeModal();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }
}
