import { Component, EventEmitter, ViewChild } from '@angular/core';
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
import { MatSidenav } from '@angular/material/sidenav';
import { ParametroEvento01 } from './parametros/parametro-evento01';
import { EventoService } from './services/evento.service';
import { EventoModel } from './models/evento-model';

type MenuKeys = 'cadastros' | 'eventos' | 'processamento' | 'sobre';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'tkx_frontend';
  showMenu: boolean = true;
  isMobile: boolean = false;

  inscricaoLogin!: Subscription;
  inscricaoEmpresa!: Subscription;
  inscricaoUsuario!: Subscription;
  inscricaoEvento!: Subscription;

  // 🔹 2. Objeto de controle do menu
  open: { [key: string]: boolean } = {
    cadastros: false,
    eventos: false,
    processamento: false,
    kits: false,
    sobre: false,
  };

  // 🔹 3. Estrutura do menu
  menu = [
    {
      key: 'cadastros',
      label: 'Cadastros',
      links: [
        { label: 'Empresas', route: 'empresas' },
        { label: 'Usuários', route: 'usuarios' },
        { label: 'Grupos de Usuários', route: 'grupos' },
        { label: 'Categorias', route: 'cadastro_padrao' },
      ],
      children: [],
    },
    {
      key: 'eventos',
      label: 'Eventos',
      links: [
        { label: 'Eventos', route: 'eventos' },
        { label: 'Participantes', route: 'participantes' },
        { label: 'Inscritos', route: 'inscritos' },
      ],
      children: [
        {
          key: 'processamento',
          label: 'Processamento',
          links: [
            { label: 'Planilhas', route: 'planilhas' },
            { label: 'Processar Planilha', route: 'planilhas_processamento' },
          ],
        },
      ],
    },
    {
      key: 'kits',
      label: 'Kits',
      links: [{ label: 'Entrega De Kits', route: 'mobile' }],
      children: [],
    },
    {
      key: 'sobre',
      label: 'Sobre',
      links: [{ label: 'Parâmetros do Sistema', route: 'param' }],
      children: [],
    },
  ];

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
    private eventoSrv: EventoService,
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
    this.globalService.changePassWordEmitter.subscribe((change) => {
      //this.openTrocaSenhaDialog(
      //  CadastroAcoes.Edicao,
      // this.globalService.getUsuario(),
      // );
    });
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

  ngOnDestroy(): void {
    this.inscricaoLogin?.unsubscribe();
    this.inscricaoUsuario?.unsubscribe();
    this.inscricaoEmpresa?.unsubscribe();
    this.inscricaoEvento?.unsubscribe();
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

  getEmpresa(id_empresa: number = 1, id_usuario: number) {
    this.inscricaoEmpresa = this.empresaService
      .getEmpresa(id_empresa)
      .subscribe({
        next: (data: EmpresaModel) => {
          this.globalService.setEmpresa(data);
          this.getUsuario(id_empresa, id_usuario);
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
          } else {
            this.appSnackBar.openFailureSnackBar(
              `Problemas Com A Empresa ${messageError(error)}`,
              'OK',
            );
          }
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
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
            this.appSnackBar.openFailureSnackBar(`Ação Não Autorizada!`, 'OK');
          } else {
            this.appSnackBar.openFailureSnackBar(
              `Problemas Com O Usuário -- APP ${messageError(error)}`,
              'OK',
            );
          }
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

  toggle(menu: string) {
    this.open[menu] = !this.open[menu];
  }

  onNavigate() {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }

  getEvento(id_empresa: number = 1) {
    const par: ParametroEvento01 = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;
    par.status = '1';
    par.contador = 'N';

    this.inscricaoEvento = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: EventoModel[]) => {
          if (this.isMobile) {
            this.router.navigate(['/mobile']);
          }
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Nenhum Evento Encontrado! ${messageError(error)}`,
            'OK',
          );
        },
      });
  }
}
