import { EntregaDialogData } from './../entrega-dialog/entrega-dialog-data';
import { DadosModel } from '../../../models/dado-model';
import { FiltroEntregaKitModel } from '../../../models/filtro-entrega-kit-model';
import { DadosService } from '../../../services/dados.service';
import { GlobalService } from './../../../services/global.service';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EntregaDialogComponent } from '../entrega-dialog/entrega-dialog.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { ParametroParticipante01 } from '../../../parametros/parametro-participante01';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { ParticipanteService } from '../../../services/participante.service';
import { ParticipanteModel } from '../../../models/participante-model';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import {
  GetValueJsonBoolean,
  MensagensBotoes,
  messageError,
} from '../../../shared/classes/util';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-mobile-kit',
  templateUrl: './mobile-kit.component.html',
  styleUrl: './mobile-kit.component.css'
})
export class MobileKitComponent {

  inscricaoParticipantes!: Subscription;


  tamPagina = 50;

  controlePaginas: ControlePaginas = new ControlePaginas(
    this.tamPagina,
    this.tamPagina
  );

  participantes: ParticipanteModel[] = [];

  lsDados:DadosModel[] = [];
  constructor(
    private appSnackBar: AppSnackbar,
    private globalService:GlobalService,
    private participanteSrv:ParticipanteService,
    private dadosService:DadosService,
    private kitEntrega:MatDialog,)
    { }

  ngOnInit(): void {
    this.globalService.setMobile(true);
    this.lsDados = this.dadosService.getDados();
    this.getParticipantes();
  }


  ngOnDestroy(): void {
    this.inscricaoParticipantes?.unsubscribe();
  }


  getParticipantes() {
    let par = new ParametroParticipante01()

    par.id_empresa = this.globalService.getEmpresa().id;

    par.id_evento = 1;

    //par = AtualizaParametroImobilizadoInventario01(par,this.parametro.getParametro());

    par.pagina = this.controlePaginas.getPaginalAtual();

   this.globalService.setSpin(true); // liga spinner

this.inscricaoParticipantes = this.participanteSrv.getParticipantesParametro_01(par)
  .pipe(finalize(() => this.globalService.setSpin(false)))
  .subscribe({
    next: (data: ParticipanteModel[]) => {
      this.participantes = data;
    },
    error: (error: any) => {
      console.log(error);
      this.participantes = [];
      this.appSnackBar.openFailureSnackBar(
        `Pesquisa Nos Participantes ${messageError(error)}`,
        'OK'
      );
    }
  });
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
