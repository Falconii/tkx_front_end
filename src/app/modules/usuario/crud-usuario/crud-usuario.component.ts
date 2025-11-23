import { UsuarioDialogData } from './../usuario-dialog/UsuarioDialogData';
import { UsuarioService } from './../../../services/usuario.service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UsuarioModel } from '../../../models/usuario-model';
import { MensagensBotoes } from '../../../shared/classes/util';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { GlobalService } from '../../../services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroUsuario01 } from '../../../parametros/parametro-usuario01';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';

import { DataDDMMYYYY } from '../../../shared/classes/util';
import { ParametroModel } from '../../../models/parametro-model';
import { AtualizaParametroUsuario01 } from '../../../shared/classes/atualiza-parametro-usuario01';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';

@Component({
  selector: 'app-crud-usuario',
  templateUrl: './crud-usuario.component.html',
  styleUrl: './crud-usuario.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CrudUsuarioComponent {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  inscricaoUsuario!: Subscription;

  usuarios: UsuarioModel[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  hide: boolean = false;

  constructor(
    private globalService: GlobalService,
    private usuarioSrv: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private usuarioDialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.inscricaoUsuario?.unsubscribe();
  }

  escolha(opcao: number, i: number, usuario?: UsuarioModel) {
    this.openUsuarioDialog(opcao, i, usuario);
  }

  onHome() {
    this.router.navigate(['']);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getUsuarios(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroUsuario01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par = AtualizaParametroUsuario01(par, this.parametro.getParametro());

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }

    console.log('Paramentros de Consulta:', par);
    this.inscricaoUsuario = this.usuarioSrv
      .getUsuariosParametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.usuarios = data;
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total
            );
            this.getUsuarios();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.usuarios = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        },
      });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getUsuarios();
  }

  onChangeHide(hide: boolean) {
    this.hide = hide;
  }

  onChangeParametros(param: ParametroModel) {
    this.parametro = param;
    console.log('Paramentro de Pesquisa', this.parametro);
    this.getUsuarios(TipoOperacao.Contador);
  }

  openUsuarioDialog(
    opcao: CadastroAcoes = CadastroAcoes.Consulta,
    i: number,
    usuario?: UsuarioModel
  ): void {
    const data: UsuarioDialogData = new UsuarioDialogData();

    if (usuario == null) {
      usuario = new UsuarioModel();
      usuario.id_empresa = this.globalService.getEmpresa().id;
      usuario.cadastr = DataDDMMYYYY(new Date());
    }
    data.opcao = opcao;
    data.processar = false;
    data.usuario = usuario;
    console.log('Ação:', opcao, data.usuario);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'crud-usuario';
    dialogConfig.width = '80vw';
    dialogConfig.height = '80vh';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-font-small';
    dialogConfig.data = data;
    const modalDialog = this.usuarioDialog
      .open(UsuarioDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: UsuarioDialogData | null) => {
        if (data?.processar) {
          switch (opcao) {
            case CadastroAcoes.Inclusao:
              this.usuarios.push(data.usuario!);
              break;
            case CadastroAcoes.Edicao:
              if (i >= 0) {
                this.usuarios[i] = data.usuario!;
              }
              break;
            case CadastroAcoes.Exclusao:
              this.usuarios.splice(i, 1);
              break;
            default:
              break;
          }
        } else {
        }
      });
  }
}
