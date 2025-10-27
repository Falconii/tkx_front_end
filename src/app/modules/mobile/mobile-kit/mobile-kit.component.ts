import { EntregaDialogData } from './../entrega-dialog/entrega-dialog-data';
import { DadosModel } from '../../../models/dado-model';
import { FiltroEntregaKitModel } from '../../../models/filtro-entrega-kit-model';
import { DadosService } from '../../../services/dados.service';
import { GlobalService } from './../../../services/global.service';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EntregaDialogComponent } from '../entrega-dialog/entrega-dialog.component';

@Component({
  selector: 'app-mobile-kit',
  templateUrl: './mobile-kit.component.html',
  styleUrl: './mobile-kit.component.css'
})
export class MobileKitComponent {

  lsDados:DadosModel[] = [];
  constructor(
    private globalService:GlobalService,
    private dadosService:DadosService,
    private kitEntrega:MatDialog,)
    { }

  ngOnInit(): void {
    this.globalService.setMobile(true);
    this.lsDados = this.dadosService.getDados()
  }

  onChangeParametro(filtro:FiltroEntregaKitModel) {
    this.lsDados = this.dadosService.getDados().filter((dado:DadosModel) => {
      if (filtro.pesquisarPor == 'CPF') {
        return dado.cpf.includes(filtro.pesquisar);
      }
      if (filtro.pesquisarPor == 'NOME') {
        return dado.nome.toUpperCase().includes(filtro.pesquisar.toUpperCase());
      }

      return dado.nro_peito.toString().includes(filtro.pesquisar);
    });

  }

  escolha(op:number, dado:DadosModel) {
      this.openKitDialog(dado);
  }


  openKitDialog(dado: DadosModel): void {
    const data: EntregaDialogData = new EntregaDialogData();
    data.dado = dado;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'trocar';
    dialogConfig.width = '600px';
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    const modalDialog = this.kitEntrega.open(EntregaDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: EntregaDialogData) => {
        //this.getImoIven();
      });
  }

}
