import { Component, Inject, OnInit } from '@angular/core';
import { EmailDialogData } from './email-dialog-data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppSnackbar } from '../../classes/app-snackbar';
import { messageError } from '../../classes/util';
import { ParametroSendemailv2 } from '../../../parametros/parametro-sendemailv2';
import { Escopo } from '../../classes/escopo';
import { EmailService } from '../../../services/email.service';
import { ValidatorStringLen } from '../../Validators/validator-string-len';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent implements OnInit {

  inscricaoEmail!: Subscription;
  inscricaoExcel!: Subscription;

  showSpin:boolean = false;
  formulario: FormGroup;
  escopos:Escopo[] = [{sigla:"T", descricao : "Toda Consulta"},{sigla:"P", descricao : "Página Atual"}]
  processando:string = "Aguardando Definições";
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    public emailService:EmailService,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: EmailDialogData,

  ) {

    this.formulario = formBuilder.group({
      destinatario: [{ value: '' },[ValidatorStringLen(1,500, true)]],
      escopo: [{ value: '' }]
    });

  }

  ngOnInit(): void {
    this.data.resposta = 'N';
    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoEmail?.unsubscribe();
    this.inscricaoExcel?.unsubscribe();
  }


  closeModal() {
    this.dialogRef.close();
  }


  setValue() {
    this.formulario.setValue({
      destinatario: this.data.destinatario,
      escopo: this.data.escopo
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
   // return this.formulario.get(field)?.errors?.message;
   return '';
  }

  onProcessar(){
    if (this.formulario.valid) {
      this.data.destinatario = this.formulario.value.destinatario;
      this.data.escopo       = this.formulario.value.escopo;
      this.GerarExcel();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  GerarExcel() {
/*
    let par = new ParametroImobilizadoinventario01();

    par.id_empresa = this.data.id_empresa;

    par.id_filial = this.data.id_filial;

    par.id_inventario = this.data.id_inventario;

    par = this.atualizaParametro(par);

    par.contador = 'N';

    par.pagina = this.data.escopo == "T" ? 0 : this.data.pagina;

    par.orderby = 'Imobilizado';

    this.processando = "Gerando Consulta Em Excel!";

    this.showSpin = true;

    this.inscricaoExcel = this.imoInventarioService
      .getExcelv2(par)
      .subscribe(
        (data: any) => {
          this.showSpin = false;
          this.sendMail(data.filename);
        },
        (error: any) => {
          this.showSpin = false;
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nos Produtos De Inventário ${messageError(error)}`,
            'OK'
          );
        }
      );
      */
  }

  sendMail(fileName:string) {

    let par = new ParametroSendemailv2();

    par.id_empresa = this.data.id_empresa;

    par.id_evento = 1;

    par.assunto = "Relatório Dos Ativos Do Inventário";

    par.destinatario =  this.data.destinatario;

    par.mensagem     = "Mensagem enviada automaticamento por solicitação do usuário. Favor Verificar Anexo."

    par.fileName = fileName;

    this.processando = "Enviando E-MAIL";

    this.showSpin = true;

    this.inscricaoEmail = this.emailService
      .sendEmailV2(par)
      .subscribe(
        (data: any) => {
          this.showSpin = false;
          this.appSnackBar.openSuccessSnackBar(
            data.message,
            'OK'
          );
          this.closeModal();
        },
        (error: any) => {
          this.showSpin = false;
          this.appSnackBar.openFailureSnackBar(
            `Falha Ao Enviar O E-Mail ${messageError(error)}`,
            'OK'
          );
        }
      );
  }


}
