import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppSnackbar } from '../../classes/app-snackbar';
import { DownloadDialogData } from './download-dialog-data';
import { messageError } from '../../classes/util';
import { Escopo } from '../../classes/escopo';
@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.css']
})
export class DownloadDialogComponent implements OnInit {

  inscricaoDownLoad!: Subscription;
  inscricaoExcel!: Subscription;

  showSpin:boolean = false;
  formulario: FormGroup;
  escopos:Escopo[] = [{sigla:"T", descricao : "Toda Consulta"},{sigla:"P", descricao : "Página Atual"}]
  processando:string = "Aguardando Definições";

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DownloadDialogComponent>,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: DownloadDialogData
  ) {
    this.formulario = formBuilder.group({
      escopo: [{ value: '' }]
    });
   }

   ngOnInit(): void {
    this.data.resposta = 'N';
    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoDownLoad?.unsubscribe();
    this.inscricaoExcel?.unsubscribe();
  }


  closeModal() {
    this.dialogRef.close();
  }


  setValue() {
    this.formulario.setValue({
      escopo: this.data.escopo
    });
  }


  onProcessar(){
    if (this.formulario.valid) {
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
          console.log(data);
          this.downLoad(data.filename);
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

  downLoad(fileName:string) {
/*

    let par = new ParametroDownloadfile();

    par.id_empresa = this.data.id_empresa;

    par.id_filial = this.data.id_filial;

    par.id_inventario = this.data.id_inventario;

    par.fileName = fileName;

    const url = this.fileService.urlDowLoad(par);

    //window.open(url, '_blank');

    window.open(url);

    this.closeModal();

    */
  }



}
