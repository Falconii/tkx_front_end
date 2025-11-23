import { Component } from '@angular/core';
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
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('TKX-Experience');
    this.globalService.isMobileEmitter.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
    this.globalService.shomMenuEmitter.subscribe((show) => {
      this.showMenu = show;
    });
    this.onLogin();
    /*  this.localStorageSrv.removeItem('Toekn');
    const token = this.localStorageSrv.getString('Token');
    if (!token) {
      this.onLogin();
    } else {
      this.getValoresIniciais();
    } */
  }

  onLogin() {
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
            'OK'
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
            'OK'
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
}
