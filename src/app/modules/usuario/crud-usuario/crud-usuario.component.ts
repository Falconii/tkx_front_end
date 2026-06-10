import { UsuarioDialogData } from './../usuario-dialog/UsuarioDialogData';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UsuarioModel } from '../../../models/usuario-model';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { MensagensBotoes, messageError } from '../../../shared/classes/util';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { GlobalService } from '../../../services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { ParametroModel } from '../../../models/parametro-model';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroUsuario01 } from '../../../parametros/parametro-usuario01';
import { AtualizaParametroUsuario01 } from '../../../shared/classes/atualiza-parametro-usuario01';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';

import { DataDDMMYYYY } from '../../../shared/classes/util';
import { ConfirmDialogService } from '../../../services/ConfirmDialog.service';
import { loginService } from '../../../services/login.service';
import { LocalStorageService } from '../../../services/localStorage.service';
import { EmpresaModel } from '../../../models/empresa-model';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-crud-usuario',
  templateUrl: './crud-usuario.component.html',
  styleUrl: './crud-usuario.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CrudUsuarioComponent {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  inscricaoUsuario!: Subscription;

  inscricaoLogOut!: Subscription;

  inscricaoIniciarSenha!: Subscription;

  inscricaoSituacao!: Subscription;

  usuarios: UsuarioModel[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  hide: boolean = false;

  constructor(
    private globalService: GlobalService,
    private usuarioSrv: UsuarioService,
    private loginSrv: loginService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private usuarioDialog: MatDialog,
    private confirmDialog: ConfirmDialogService,

    private localStorageSrv: LocalStorageService,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.inscricaoUsuario?.unsubscribe();
    this.inscricaoLogOut?.unsubscribe();
    this.inscricaoIniciarSenha?.unsubscribe();
    this.inscricaoSituacao?.unsubscribe();
  }

  escolha(opcao: number, i: number, usuario?: UsuarioModel) {
    if (opcao == CadastroAcoes.Zerar_Senha && usuario) {
      this.onZerarSenha(i, usuario);
      return;
    }
    if (opcao == CadastroAcoes.Ativar_Inativar && usuario) {
      this.onTrocaSituacao(usuario);
      return;
    }

    this.openUsuarioDialog(opcao, i, usuario);
  }

  onZerarSenha(i: number, usuario: UsuarioModel) {
    this.confirmDialog
      .open({
        title: 'Zerar Senha',
        message: `Deseja Realmente Zerar A Senha ?`,
        icon: 'warning',
        iconColor: 'warn',
        confirmText: 'Zerar',
        cancelText: 'Cancelar',
      })
      .subscribe(async (result) => {
        if (result) {
          this.trocarSenha(usuario);
        }
      });
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
              data.total == 0 ? 1 : data.total,
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
    usuario?: UsuarioModel,
  ): void {
    const data: UsuarioDialogData = new UsuarioDialogData();

    if (usuario == null) {
      usuario = new UsuarioModel();
      usuario.id_empresa = this.globalService.getEmpresa().id;
      usuario.cadastr = DataDDMMYYYY(new Date());
      usuario.trocarsenha = 'S';
    }
    data.opcao = opcao;
    data.processar = false;
    data.usuario = usuario;
    console.log('Ação:', opcao, data.usuario);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'crud-usuario';
    dialogConfig.width = '80vw';
    dialogConfig.height = '90vh';
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
              this.usuarios.push(data.usuario);
              break;
            case CadastroAcoes.Edicao:
              if (usuario.id == this.globalService.getUsuario().id) {
                this.logOutUsuario();
              } else {
                if (i >= 0) {
                  this.usuarios[i] = data.usuario!;
                }
              }
              break;
            case CadastroAcoes.Exclusao:
              if (usuario.id == this.globalService.getUsuario().id) {
                this.logOutUsuario();
              } else {
                this.usuarios.splice(i, 1);
              }
              break;
            default:
              break;
          }
        } else {
        }
      });
  }

  trocarSenha(usuario: UsuarioModel) {
    const par = {
      id_empresa: usuario.id_empresa,
      id_usuario: usuario.id,
    };

    this.inscricaoUsuario = this.loginSrv.zerarSenha(par).subscribe({
      next: (data: any) => {
        if (usuario.id == this.globalService.getUsuario().id) {
          this.logOutUsuario();
        } else {
          this.appSnackBar.openSuccessSnackBar(
            'Senha Resetada Com Sucesso!',
            'OK',
          );
        }
      },
      error: (error: any) => {
        console.log('ERRO: ', error);
        this.appSnackBar.openFailureSnackBar(
          'Falha Na Reciclagem Da Senha!',
          'OK',
        );
      },
    });
  }

  Ativar_Inativar(usuario: UsuarioModel) {
    usuario.ativo = usuario.ativo == 'S' ? 'N' : 'S';

    this.inscricaoSituacao = this.usuarioSrv
      .usuarioUpdateAtivo(usuario)
      .subscribe({
        next: (data: any) => {
          this.appSnackBar.openSuccessSnackBar(
            'Usuário Alterado Com Sucesso!',
            'OK',
          );
        },
        error: (error: any) => {
          console.log('ERRO: ', error);
          this.appSnackBar.openFailureSnackBar(
            'Falha Na Atualização Do Usuario!',
            'OK',
          );
        },
      });
  }

  logOutUsuario() {
    this.inscricaoLogOut = this.usuarioSrv.logout().subscribe({
      next: (any) => {
        this.localStorageSrv.clear();
        this.globalService.setLogado(false);
        this.globalService.setUsuario(new UsuarioModel());
        this.globalService.setEmpresa(new EmpresaModel());
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        this.appSnackBar.openFailureSnackBar(
          `Problemas Com O Usuário ${messageError(error)}`,
          'OK',
        );
        this.localStorageSrv.clear();
        this.globalService.setLogado(false);
        this.globalService.setUsuario(new UsuarioModel());
        this.globalService.setEmpresa(new EmpresaModel());
        this.router.navigate(['/login']);
      },
    });
  }

  onTrocaSituacao(usuario: UsuarioModel) {
    const msg =
      usuario.ativo == 'S'
        ? 'Deseja Realmente Inativar O Usuário ?'
        : 'Deseja Realmente Ativar O Usuário ?';
    this.confirmDialog
      .open({
        title: 'Troca De Situação',
        message: msg,
        icon: 'warning',
        iconColor: 'warn',
        confirmText: `Sim`,
        cancelText: 'Cancelar',
      })
      .subscribe(async (result) => {
        if (result) {
          this.Ativar_Inativar(usuario);
        }
      });
  }
}
