import { GlobalService } from './../../../services/global.service';
import { Component, ViewChild } from '@angular/core';
import { MensagensBotoes } from '../../../shared/classes/util';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DataDDMMYYYY } from '../../../shared/classes/util';
import { ParametroModel } from '../../../models/parametro-model';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { EventoModel } from '../../../models/evento-model';
import { EventoService } from '../../../services/evento.service';
import { EventoDialogData } from '../evento-dialog/EventoDialogData';
import { EventoDialogComponent } from '../evento-dialog/evento-dialog.component';
import { ParametroUsuario01 } from '../../../parametros/parametro-usuario01';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { AtualizaParametroEvento01 } from '../../../shared/classes/atualiza-parametro-evento01';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioModule } from '../../usuario/usuario.module';
import { EmpresaModel } from '../../../models/empresa-model';
import { ConfirmDialogService } from '../../../services/ConfirmDialog.service';

@Component({
  selector: 'app-crud-evento',
  templateUrl: './crud-evento.component.html',
  styleUrl: './crud-evento.component.scss',
})
export class CrudEventoComponent {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  inscricaoEvento!: Subscription;

  inscricaoSituacao!: Subscription;

  eventos: EventoModel[] = [];

  usuarios: UsuarioModule[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  hide: boolean = false;

  constructor(
    private globalService: GlobalService,
    private eventoSrv: EventoService,
    private usuarioSrv: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private eventoDialog: MatDialog,
    private confirmDialog: ConfirmDialogService,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.inscricaoEvento?.unsubscribe();
    this.inscricaoSituacao?.unsubscribe();
  }

  getEmpresa(): EmpresaModel {
    return this.globalService.getEmpresa();
  }

  escolha(opcao: number, i: number, evento?: EventoModel) {
    if (evento) {
      switch (opcao) {
        case this.getAcoes().Liberar:
          this.alteraSituacao(opcao, evento);
          break;

        case this.getAcoes().Ativar:
          this.alteraSituacao(opcao, evento);
          break;

        case this.getAcoes().Encerrar:
          this.alteraSituacao(opcao, evento);
          break;
        default:
          this.openEventooDialog(opcao, i, evento);
          break;
      }
    } else {
      this.openEventooDialog(opcao, i, evento);
    }
  }

  onHome() {
    this.router.navigate(['']);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getEventos(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par = AtualizaParametroEvento01(par, this.parametro.getParametro());

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }

    console.log('Paramentros de Consulta:', par);
    this.inscricaoEvento = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.eventos = data;
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total,
            );
            this.getEventos();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.eventos = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        },
      });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getEventos();
  }

  onChangeHide(hide: boolean) {
    this.hide = hide;
  }

  onChangeParametros(param: ParametroModel) {
    this.parametro = param;
    console.log('Paramentro de Pesquisa', this.parametro);
    this.getEventos(TipoOperacao.Contador);
  }

  openEventooDialog(
    opcao: CadastroAcoes = CadastroAcoes.Consulta,
    i: number,
    evento?: EventoModel,
  ): void {
    const data: EventoDialogData = {
      indice: i,
      opcao: opcao,
      processar: false,
      evento: evento ?? {
        ...new EventoModel(),
        id_empresa: this.globalService.getEmpresa().id,
        inicio: DataDDMMYYYY(new Date()),
      },
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'evento-dialog-fullscreen';

    // FULLSCREEN REAL
    dialogConfig.width = '100vw';
    dialogConfig.height = '100vh';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.panelClass = 'fullscreen-dialog';

    dialogConfig.data = data;

    this.eventoDialog
      .open(EventoDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((result: EventoDialogData | null) => {
        if (result?.processar) {
          switch (opcao) {
            case CadastroAcoes.Inclusao:
              this.eventos.push(result.evento!);
              break;

            case CadastroAcoes.Edicao:
              if (i >= 0) this.eventos[i] = result.evento!;
              break;

            case CadastroAcoes.Exclusao:
              if (result.indice >= 0) {
                this.eventos.splice(result.indice, 1);
              }
              break;
          }
        }
      });
  }

  alteraSituacao(opcao: CadastroAcoes, evento: EventoModel) {
    let config: any = {};
    let situacao: string = '0';

    if (this.getAcoes().Liberar && !(this.globalService.getUsuario().grupo == 1 || this.globalService.getUsuario().grupo == 99 ))
    {
      this.appSnackBar.openFailureSnackBar("Somente Master Pode Usar Esta Função!","OK");
      return;
    }
    switch (opcao) {
      case this.getAcoes().Liberar:
        config = {
          title: 'Liberação De Evento',
          message: `Deseja Realmente Liberar Este Evento ?` ,
          icon: 'warning',
          iconColor: 'warn',
          confirmText: 'Liberar',
          cancelText: 'Cancelar',
        };
        situacao = '1';
        break;

      case this.getAcoes().Ativar:
        config = {
          title: 'Ativar O Evento',
          message: `Deseja Realmente Ativar O Evento ?`,
          icon: 'warning',
          iconColor: 'warn',
          confirmText: 'Ativar',
          cancelText: 'Cancelar',
        };
        situacao = '3';
        break;

      case this.getAcoes().Encerrar:
        config = {
          title: 'Encerrar O Evento',
          message: `Deseja Realmente Encerrar O Evento ?`,
          icon: 'warning',
          iconColor: 'warn',
          confirmText: 'Encerrar',
          cancelText: 'Cancelar',
        };
        situacao = '4';
        break;

      default:
        break;
    }
    this.confirmDialog.open(config).subscribe(async (result) => {
      if (result) {
        evento.user_update = this.globalService.getUsuario().id;
        evento.status = situacao;
        this.inscricaoSituacao = this.eventoSrv.eventoUpdate(evento).subscribe({
          next: (data: any) => {
            this.appSnackBar.openSuccessSnackBar(
              `Situação Do Evento Alterada !`,
              'OK',
            );
            evento.status = situacao;
          },
          error: (error: any) => {
            this.appSnackBar.openFailureSnackBar(
              `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK',
            );
          },
        });
      }
    });
  }
}
