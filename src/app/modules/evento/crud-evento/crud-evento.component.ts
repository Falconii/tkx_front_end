import { Component, ViewChild } from '@angular/core';
import { MensagensBotoes } from '../../../shared/classes/util';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { GlobalService } from '../../../services/global.service';
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

@Component({
  selector: 'app-crud-evento',
  templateUrl: './crud-evento.component.html',
  styleUrl: './crud-evento.component.scss',
})
export class CrudEventoComponent {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  inscricaoEvento!: Subscription;

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
    private eventoDialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.inscricaoEvento?.unsubscribe();
  }

  escolha(opcao: number, i: number, evento?: EventoModel) {
    this.openEventooDialog(opcao, i, evento);
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
              data.total == 0 ? 1 : data.total
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
    evento?: EventoModel
  ): void {
    const data: EventoDialogData = new EventoDialogData();

    if (evento == null) {
      evento = new EventoModel();
      evento.id_empresa = this.globalService.getEmpresa().id;
      evento.inicio = DataDDMMYYYY(new Date());
    }
    data.opcao = opcao;
    data.processar = false;
    data.evento = evento;
    console.log('Ação:', opcao, data.evento);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'crud-usuario';
    dialogConfig.width = '80vw';
    dialogConfig.height = '80vh';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-font-small';
    dialogConfig.data = data;
    const modalDialog = this.eventoDialog
      .open(EventoDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: EventoDialogData | null) => {
        if (data?.processar) {
          switch (opcao) {
            case CadastroAcoes.Inclusao:
              this.eventos.push(data.evento!);
              break;
            case CadastroAcoes.Edicao:
              if (i >= 0) {
                this.eventos[i] = data.evento!;
              }
              break;
            case CadastroAcoes.Exclusao:
              this.eventos.splice(i, 1);
              break;
            default:
              break;
          }
        } else {
        }
      });
  }
}
