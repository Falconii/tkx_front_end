import { loginService } from './../../../services/login.service';
import { EmpresaModel } from './../../../models/empresa-model';
import { Component, EventEmitter, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { GlobalService } from '../../../services/global.service';
import { UsuarioService } from '../../../services/usuario.service';
import { EmpresaService } from '../../../services/empresa.service';
import { UsuarioModel } from '../../../models/usuario-model';
import { messageError } from '../../../shared/classes/util';
import { LocalStorageService } from '../../../services/localStorage.service';
import { PayLoadModel } from '../../../models/payload-model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { EventoModel } from '../../../models/evento-model';
import { EventoService } from '../../../services/evento.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formulario: FormGroup;
  empresa: EmpresaModel = new EmpresaModel();
  usuario: UsuarioModel = new UsuarioModel();
  inscricaoUsuario!: Subscription;
  inscricaoEmpresa!: Subscription;
  inscricaoLogin!: Subscription;
  inscricaoEvento!: Subscription;

  isMobile = false;
  evento: EventoModel = new EventoModel();

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuarioService,
    private empresasServices: EmpresaService,
    private localStorageSrv: LocalStorageService,
    private loginSrv: loginService,
    private eventoSrv: EventoService,
    private router: Router,
    private matDialog: MatDialog,
    private appSnackBar: AppSnackbar,
    private breakpoint: BreakpointObserver,
  ) {
    this.formulario = this.formulario = formBuilder.group({
      id: [{ value: '' }],
      senha: [{ value: '' }],
    });
    // Detecta mobile automaticamente

    this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit(): void {
    this.setValue();
    this.getValoresIniciais();
  }

  ngOnDestroy(): void {
    this.inscricaoUsuario?.unsubscribe();
    this.inscricaoEmpresa?.unsubscribe();
    this.inscricaoLogin?.unsubscribe();
    this.inscricaoEvento?.unsubscribe();
  }

  setValue() {
    this.formulario.setValue({
      id:
        this.globalService.getUsuario().id > 0
          ? this.globalService.getUsuario().id
          : '',
      senha: '',
    });
  }

  setValueNoParam() {
    this.formulario.setValue({
      id: '',
      senha: '',
    });
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
    } else {
      this.globalService.setOnSubmit(false);
    }
  }

  getEmpresa(id_empresa: number = 1, id_usuario: number) {
    this.inscricaoEmpresa = this.empresasServices
      .getEmpresa(id_empresa)
      .subscribe({
        next: (data: EmpresaModel) => {
          this.globalService.setOnSubmit(false);
          this.globalService.setEmpresa(data);
          this.getUsuario(id_empresa, id_usuario);
        },
        error: (error: any) => {
          this.globalService.setOnSubmit(false);
          console.log('Login', error);
          this.appSnackBar.openFailureSnackBar(
            `Problemas Com A Empresa ${messageError(error)}`,
            'OK',
          );
        },
      });
  }

  getUsuario(id_empresa: number, id_usuario: number) {
    this.inscricaoUsuario = this.usuariosService
      .getUsuario(id_empresa, id_usuario)
      .subscribe({
        next: (data: UsuarioModel) => {
          this.globalService.setUsuario(data);
          this.globalService.setLogado(true);
        },
        error: (error: any) => {
          this.globalService.setOnSubmit(false);
          this.appSnackBar.openFailureSnackBar(
            `Problemas Com O Usuário ${messageError(error)}`,
            'OK',
          );
          this.globalService.setUsuario(new UsuarioModel());
          this.globalService.setLogado(false);
        },
      });
  }

  getLogin(id_empresa: number = 1, id_usuario: number, senha: string) {
    const par = {
      id_empresa: id_empresa,
      codigo: id_usuario,
      password: senha,
    };
    this.inscricaoLogin = this.loginSrv.login(par).subscribe({
      next: (data: any) => {
        console.log('Buscando Empresa');
        this.localStorageSrv.setString('Token', data.accessToken);
        this.getEmpresa(data.id_empresa, data.id);
      },
      error: (error: any) => {
        this.globalService.setOnSubmit(false);
        console.log('error', error);
        this.appSnackBar.openFailureSnackBar(
          `Problemas Com O Login - GetLogin`,
          'OK',
        );
      },
    });
  }

  onValidar() {
    this.globalService.setOnSubmit(true);
    const id_usuario = this.formulario.value.id;
    const senha = this.formulario.value.senha;
    this.getLogin(this.globalService.getEmpresa().id, id_usuario, senha);
  }

  onCancelar() {
    this.router.navigate(['/']);
  }

  onSair() {
    this.globalService.setLogado(false);
    this.globalService.setUsuario(new UsuarioModel());
    this.localStorageSrv.removeItem('Token');
    this.router.navigate(['/']);
  }

  onEsqueceu(): void {
    // this.showDialog('Ola....');
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

  getEvento(id_empresa: number = 1) {
    const par: ParametroEvento01 = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;
    par.status = '1';
    par.contador = 'N';

    this.inscricaoEvento = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: EventoModel[]) => {
          console.log(data);
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
