import { TipoOperacao } from './../../../shared/classes/tipo-operacao';
import { EntregaDialogData } from './../entrega-dialog/entrega-dialog-data';
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
import { TipoPesquisa } from '../../../shared/classes/tipo-pesquisa';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { LocalStorageService } from '../../../services/localStorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-kit',
  templateUrl: './mobile-kit.component.html',
  styleUrl: './mobile-kit.component.css',
})
export class MobileKitComponent {
  inscricaoParticipantes!: Subscription;

  tamPagina = 50;

  parametroPesquisa: FiltroEntregaKitModel = new FiltroEntregaKitModel();

  controlePaginas: ControlePaginas = new ControlePaginas(
    this.tamPagina,
    this.tamPagina,
  );

  participantes: ParticipanteModel[] = [];

  constructor(
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService,
    private participanteSrv: ParticipanteService,
    private localStorageSrv: LocalStorageService,
    private router: Router,
    private kitEntrega: MatDialog,
  ) {}

  ngOnInit(): void {
    this.globalService.setMobile(true);
    this.getParticipantes();
  }

  ngOnDestroy(): void {
    this.inscricaoParticipantes?.unsubscribe();
  }

  getParticipantes() {
    let key: number = 0;

    let inscricao: number = 0;

    key = parseInt(this.parametroPesquisa.pesquisar);

    if (isNaN(key)) {
      inscricao = 0;
    } else {
      inscricao = key;
    }
    let par = new ParametroParticipante01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.id_evento = 1;

    par.kit = this.parametroPesquisa.kit;

    switch (this.parametroPesquisa.pesquisarPor) {
      case TipoPesquisa.Nome:
        par.inscrito_nome = this.parametroPesquisa.pesquisar;
        break;

      case TipoPesquisa.Cpf:
        par.inscrito_cpf = this.parametroPesquisa.pesquisar;
        break;

      case TipoPesquisa.Inscricao:
        par.inscricao = inscricao;
        break;
    }

    par.pagina = this.controlePaginas.getPaginalAtual();

    this.globalService.setSpin(true); // liga spinner

    this.inscricaoParticipantes = this.participanteSrv
      .getParticipantesParametro_01(par)
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: ParticipanteModel[]) => {
          this.participantes = data;
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
            this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
            return;
          }
          if (error.status && error.status == 409) {
            this.participantes = [];
          } else {
            this.participantes = [];
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nos Participantes ${messageError(error)}`,
              'OK',
            );
          }
        },
      });
  }

  onChangeParametro(filtro: FiltroEntregaKitModel) {
    this.parametroPesquisa = filtro;
    this.getParticipantes();
  }

  escolha(op: number, dado: ParticipanteModel) {
    if (op == CadastroAcoes.Kit) {
      this.openKitDialog(dado);
    }
  }

  novoInscrito() {
    this.router.navigate(['mobile/novoinscrito/']);
  }

  onHome() {}

  openKitDialog(dado: ParticipanteModel): void {
    const data: EntregaDialogData = new EntregaDialogData();
    data.dado = dado;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'trocar';
    dialogConfig.width = '700px';
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    const modalDialog = this.kitEntrega
      .open(EntregaDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: EntregaDialogData) => {
        if (data.processar) {
          dado.entre_tam_camisa = data.entrega.tam_camisa;
          dado.entre_nome = data.entrega.nome_retirada;
          dado.entre_rg = data.entrega.rg_retirada;
          console.log('dado', dado);
        }
      });
  }
}
