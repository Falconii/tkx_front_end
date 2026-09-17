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
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioModel } from '../../../models/usuario-model';
import { EventoModel } from '../../../models/evento-model';
import { EventoService } from '../../../services/evento.service';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { Participantev2Service } from '../../../services/participantev2.service';
import { ParametroParticipantev201 } from '../../../parametros/parametro-participantev201';
import { Participantev2Model } from '../../../models/participantev2-model';
import { EntregaV2DialogData } from '../entrega-dialog/entrega-v2-dialog-data';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConfirmDialogService } from '../../../services/ConfirmDialog.service';
import { Entregav2Service } from '../../../services/entregav2.service';
import { Entregav2Model } from '../../../models/entregav2-model';
import { EntregaparticipanteModel } from '../../../models/entregaparticipante-model';
import { Entregasv2ComplementarService } from '../../../services/entregasv2Complementar.service';

@Component({
  selector: 'app-mobile-kit',
  templateUrl: './mobile-kit.component.html',
  styleUrl: './mobile-kit.component.css',
})
export class MobileKitComponent {

  inscricaoParticipantes!: Subscription;
  inscricaoEventoAtivo!: Subscription;
  inscricaoDelete!:Subscription;
  inscricaoEntrega!:Subscription;

  tamPagina = 50;

  parametroPesquisa: FiltroEntregaKitModel = new FiltroEntregaKitModel();

  participantes: Participantev2Model[] = [];

  evento: EventoModel = new EventoModel();

  isMobile: boolean = false;

  entregav2:Entregav2Model = new Entregav2Model();

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);


  constructor(
    private appSnackBar: AppSnackbar,
    private globalService: GlobalService,
    private eventoSrv: EventoService,
    private participanteSrv: Participantev2Service,
    private localStorageSrv: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private kitEntrega: MatDialog,
    private breakpoint: BreakpointObserver,
    private confirmDialog: ConfirmDialogService,
    private entregaComplementarSrv:Entregasv2ComplementarService,
    private entregaSrv:Entregav2Service
  ) {
     this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
  }

  ngOnInit(): void {
    this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
          this.isMobile = result.matches;
        });
    const data = this.route.snapshot.data['eventoAtivo'];
    this.evento = data.length > 0 ? data[0] : new EventoModel();
    if (this.evento.id == 0 && !this.isMobile) {
      this.onHome();
    }
    this.getParticipantes(TipoOperacao.Contador);
  }

  ngOnDestroy(): void {
    this.inscricaoParticipantes?.unsubscribe();
    this.inscricaoEventoAtivo?.unsubscribe();
    this.inscricaoDelete?.unsubscribe();
    this.inscricaoEntrega?.unsubscribe();
  }

  getParticipantes(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    if (!this.evento.id_empresa || this.evento.id == 0) {
      return;
    }

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

    par.kit = this.parametroPesquisa.kit;

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

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }
    console.log('Parâmetros Enviados', par);

    this.inscricaoParticipantes = this.participanteSrv
      .getParticipantesv2Parametro_01(par)
      .subscribe({
        next: (data:any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.participantes = data;
            console.log('Participantes Encontrados:', this.participantes);
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total,
            );
            console.log('Controle de Páginas Atualizado:', this.controlePaginas);
            this.getParticipantes();
          }
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
            this.appSnackBar.openFailureSnackBar('Ação Não Autorizada', 'OK');
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
          } else {
            this.evento = new EventoModel();
          }
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
            this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
            return;
          } else {
            if (error.status && error.status == 409) {
              this.appSnackBar.openFailureSnackBar(
                'Nenhum Evento Ativo Encontrado Para Pesquisa Dos Participantes!',
                'OK',
              );
            } else {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Pesquisa Dos Eventos ${messageError(error)}`,
                'OK',
              );
            }
          }
        },
      });
  }

  onChangeParametro(filtro: FiltroEntregaKitModel) {
    this.parametroPesquisa = filtro;
    this.getParticipantes(TipoOperacao.Contador);
  }

  onChangePage() {
    this.getParticipantes();
  }

  escolha(op: number, dado: Participantev2Model,index:number) {
    if (op == CadastroAcoes.Exclusao){
       this.onExcluir(dado,index);
    }
    if (op == CadastroAcoes.Kit) {
      this.openKitDialog(dado, index);
    }
  }

  novoInscrito() {
    this.router.navigate(['mobile/novoinscrito/']);
  }

  onSair() {
    this.globalService.setLogado(false);
    this.globalService.setUsuario(new UsuarioModel());
    this.localStorageSrv.removeItem('Token');
    this.router.navigate(['/login']);
  }

  onHome(){
    this.router.navigate(['/home']);
  }

  openKitDialog(participantev2: Participantev2Model,index:number): void {
    const data: EntregaV2DialogData = new EntregaV2DialogData();
    data.participantev2 = { ...participantev2 }; // ← cópia
    data.index = index;
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
            this.participantes = [...this.participantes.slice(0, data.index),
            { ...data.participantev2 },
              ...this.participantes.slice(data.index + 1)
        ];
        }
      });
  }


  onExcluir(participantev2:Participantev2Model,index:number) {
    this.confirmDialog
      .open({
        title: 'Exclusão',
        message: `Deseja Realmente Excluir o Kit ?`,
        icon: 'warning',
        iconColor: 'warn',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe(async (result) => {
        if (result) {
           this.getEntrega(participantev2,index);
        }
      });
  }

  deleteEntrega(participantev2:Participantev2Model,entregav2:Entregav2Model,index:number) {
   this.inscricaoDelete = this.entregaComplementarSrv.deleteentregaparticipante(participantev2.id,entregav2)
      .subscribe({
        next: (data: EntregaparticipanteModel) => {
          this.participantes[index] = data.Participantev2;
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Erro Na Exclusão Do Kit ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK',
          );
        },
      });

  }

  getEntrega(participantev2:Participantev2Model,index:number) {
    this.inscricaoEntrega = this.entregaSrv
      .getEntregav2(
        participantev2.id_empresa,
        participantev2.id_evento,
        participantev2.id_entrega,
      )
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: Entregav2Model) => {
          this.deleteEntrega(participantev2,data,index);
        },
        error: (error: any) => {
          console.log('Erro: ', error.status);
          if (error.status && error.status == 409) {
             this.appSnackBar.openFailureSnackBar(
              `Kit Não Encontrado!`,
              'OK',
            );
          } else {
            this.appSnackBar.openFailureSnackBar(
              `Erro Na Pesquisa Dos Kits ${messageError(error)}`,
              'OK',
            );
          }
        },
      });
  }


}
