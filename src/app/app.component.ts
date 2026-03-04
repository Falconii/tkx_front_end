import { Component, EventEmitter } from '@angular/core';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from './models/usuario-model';
import { Title } from '@angular/platform-browser';
import { EmpresaService } from './services/empresa.service';
import { LocalStorageService } from './services/localStorage.service';
import { UsuarioService } from './services/usuario.service';
import { AppSnackbar } from './shared/classes/app-snackbar';
import { loginService } from './services/login.service';
import { messageError } from './shared/classes/util';
import { EmpresaModel } from './models/empresa-model';
import { PayLoadModel } from './models/payload-model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CadastroAcoes } from './shared/classes/cadastro-acoes';
import { Usuariotrocasenhadata } from './modules/usuario/usuario-troca-senha-dialog/usuariotrocasenhadata';
import { UsuarioTrocaSenhaDialogComponent } from './modules/usuario/usuario-troca-senha-dialog/usuario-troca-senha-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsuarioDialogComponent } from './modules/usuario/usuario-dialog/usuario-dialog.component';
import { UsuarioDialogData } from './modules/usuario/usuario-dialog/UsuarioDialogData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'tkx_frontend';
  showMenu: boolean = true;
  isMobile: boolean = false;

  inscricaoLogin!: Subscription;
  inscricaoEmpresa!: Subscription;
  inscricaoUsuario!: Subscription;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private localStorageSrv: LocalStorageService,
    private loginSrv: loginService,
    private appSnackBar: AppSnackbar,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private titleService: Title,
    private breakpoint: BreakpointObserver,

    private usuarioDialog: MatDialog,
  ) {
    this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('TKX-Experience');

    this.globalService.shomMenuEmitter.subscribe((show) => {
      this.showMenu = show;
    });
    const token = this.localStorageSrv.getString('Token');
    if (!token) {
      this.onLogin();
    } else {
      this.getValoresIniciais();
    }
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onPerfil() {}

  onAlterarSenha() {}

  onSair() {
    this.localStorageSrv.clear();
    this.globalService.setLogado(false);
    this.globalService.setUsuario(new UsuarioModel());
    this.globalService.setEmpresa(new EmpresaModel());
    this.router.navigate(['/login']);
  }

  getUsuarioNome(): UsuarioModel {
    return this.globalService.getUsuario();
  }

  getValoresIniciais() {
    const token = this.localStorageSrv.getString('Token');
    if (token) {
      const payload = this.getPayloadData(token);
      if (payload) {
        if (payload.id_empresa && payload.id_usuario) {
          this.getEmpresa(payload.id_empresa, payload.id_usuario);
        }
      }
    }
  }

  getEmpresa(id_empresa: number, id_usuario: number) {
    this.inscricaoEmpresa = this.empresaService
      .getEmpresa(id_empresa)
      .subscribe({
        next: (data: EmpresaModel) => {
          this.globalService.setEmpresa(data);
          this.getUsuario(id_empresa, id_usuario);
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas Com A Empresa ${messageError(error)}`,
            'OK',
          );
        },
      });
  }

  getUsuario(id_empresa: number, id_usuario: number) {
    this.inscricaoUsuario = this.usuarioService
      .getUsuario(id_empresa, id_usuario)
      .subscribe({
        next: (data: UsuarioModel) => {
          this.globalService.setUsuario(data);
          this.globalService.setLogado(true);
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas Com O Usuário ${messageError(error)}`,
            'OK',
          );

          this.globalService.setUsuario(new UsuarioModel());
          this.globalService.setLogado(false);
        },
      });
  }

  getPayloadData(token: string): PayLoadModel | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const retorno: PayLoadModel = new PayLoadModel();

      retorno.id_empresa = payload.id_empresa;
      retorno.id_usuario = payload.id_usuario;

      return retorno;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  openUsuarioDialog(
    opcao: CadastroAcoes = CadastroAcoes.Edicao,
    usuario: UsuarioModel,
  ): void {
    const data: UsuarioDialogData = new UsuarioDialogData();

    if (usuario == null) {
      return;
    }
    data.opcao = opcao;
    data.processar = false;
    data.usuario = usuario;
    console.log('Ação:', opcao, data.usuario);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'crud-usuario';
    dialogConfig.width = '90vw';
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
            case CadastroAcoes.Edicao:
              this.globalService.setUsuario(data.usuario!);
              break;
            default:
              break;
          }
        } else {
        }
      });
  }
}
