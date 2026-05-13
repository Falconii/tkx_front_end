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
import { UsuarioModel } from '../../../models/usuario-model';
import { EventoModel } from '../../../models/evento-model';
import { EventoService } from '../../../services/evento.service';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { Participantev2Service } from '../../../services/participantev2.service';
import { ParametroParticipantev201 } from '../../../parametros/parametro-participantev201';
import { Participantev2Model } from '../../../models/participantev2-model';
import { EntregaV2DialogData } from '../entrega-dialog/entrega-v2-dialog-data';

@Component({
  selector: 'app-mobile-kit',
  templateUrl: './mobile-kit.component.html',
  styleUrl: './mobile-kit.component.css',
})
export class MobileKitComponent {
  inscricaoParticipantes!: Subscription;
  inscricaoEventoAtivo!: Subscription;

  tamPagina = 50;

  parametroPesquisa: FiltroEntregaKitModel = new FiltroEntregaKitModel();

  controlePaginas: ControlePaginas = new ControlePaginas(
    this.tamPagina,
    this.tamPagina,
  );

  participantes: Participantev2Model[] = [];

  evento: EventoModel = new EventoModel();

  constructor(
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService,
    private eventoSrv: EventoService,
    private participanteSrv: Participantev2Service,
    private localStorageSrv: LocalStorageService,
    private router: Router,
    private kitEntrega: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getEventoAtivo();
  }

  ngOnDestroy(): void {
    this.inscricaoParticipantes?.unsubscribe();
    this.inscricaoEventoAtivo?.unsubscribe();
  }

  getParticipantes() {
    let key: number = 0;

    let inscricao: number = 0;

    let nro_peito: number = 0;

    key = parseInt(this.parametroPesquisa.pesquisar);

    if (isNaN(key)) {
      inscricao = 0;
    } else {
      inscricao = key;
    }

    if (isNaN(key)) {
      nro_peito = 0;
    } else {
      nro_peito = key;
    }

    let par = new ParametroParticipantev201();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.id_evento = this.evento.id;

    //par.kit = this.parametroPesquisa.kit;

    switch (this.parametroPesquisa.pesquisarPor) {
      case TipoPesquisa.Nome:
        par.nome = this.parametroPesquisa.pesquisar;
        break;

      case TipoPesquisa.Cpf:
        par.cnpj_cpf = this.parametroPesquisa.pesquisar;
        break;

      case TipoPesquisa.Inscricao:
        par.inscricao = inscricao;
        break;

      case TipoPesquisa.Nro_Peito:
        par.nro_peito = nro_peito;
        break;
    }

    par.orderby = '000003';

    par.pagina = this.controlePaginas.getPaginalAtual();

    par.tamPagina = 200;

    this.globalService.setSpin(true); // liga spinner

    this.inscricaoParticipantes = this.participanteSrv
      .getParticipantesv2Parametro_01(par)
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: Participantev2Model[]) => {
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

  getEventoAtivo() {
    const par: ParametroEvento01 = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.status = '3';

    par.orderby = '000001';

    this.inscricaoEventoAtivo = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: EventoModel[]) => {
          if (data.length > 0) {
            this.evento = data[0];
            this.getParticipantes();
          } else {
            this.appSnackBar.openFailureSnackBar(
              'Nenhum Evento Ativo Encontrado!',
              'OK',
            );
            this.evento = new EventoModel();
          }
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
            this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
            return;
          } else {
            this.appSnackBar.openFailureSnackBar(
              `Erro Na Pesquisa Dos Eventos ${messageError(error)}`,
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

  escolha(op: number, dado: Participantev2Model) {
    if (op == CadastroAcoes.Kit) {
      this.openKitDialog(dado);
    }
  }

  novoInscrito() {
    this.router.navigate(['mobile/novoinscrito/']);
  }

  onHome() {
    this.globalService.setLogado(false);
    this.globalService.setUsuario(new UsuarioModel());
    this.localStorageSrv.removeItem('Token');
    this.router.navigate(['/login']);
  }

  openKitDialog(dado: Participantev2Model): void {
    const data: EntregaV2DialogData = new EntregaV2DialogData();
    data.dado = dado;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'trocar';
    dialogConfig.width = '700px';
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    const modalDialog = this.kitEntrega
      .open(EntregaDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: EntregaV2DialogData) => {
        if (data.processar) {
          dado = data.dado;
        }
      });
  }
}
