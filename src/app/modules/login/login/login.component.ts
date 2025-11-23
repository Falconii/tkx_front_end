import { loginService } from './../../../services/login.service';
import { EmpresaModel } from './../../../models/empresa-model';
import { Component, numberAttribute } from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  formulario: FormGroup;
  empresa: EmpresaModel = new EmpresaModel();
  usuario: UsuarioModel = new UsuarioModel();
  inscricaoUsuario!: Subscription;
  inscricaoEmpresa!: Subscription;
  inscricaoLogin!: Subscription;


  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuarioService,
    private empresasServices: EmpresaService,
    private localStorageSrv: LocalStorageService,
    private loginSrv: loginService,
    private router: Router,
    private matDialog: MatDialog,
    private appSnackBar: AppSnackbar) {
     this.formulario = this.formulario = formBuilder.group({
      id: [{ value: '' }],
      senha: [{ value: '' }],
    });
   //this.getValoresIniciais();
   //this.setValueNoParam()
  }

    ngOnInit(): void {
   this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoUsuario?.unsubscribe();
    this.inscricaoEmpresa?.unsubscribe();
    this.inscricaoLogin?.unsubscribe();
  }

  setValue() {
    this.formulario.setValue({
      id: this.globalService.getUsuario().id,
      senha: ''
    });
  }

  setValueNoParam() {
    this.formulario.setValue({
      id: '',
      senha: ''
    });
  }


  getValoresIniciais() {

    const token = this.localStorageSrv.getString('Token') ;
    if (token) {
      const payload = this.getPayloadData(token);
      if (payload) {
         if (payload.id_empresa && payload.id_usuario) {
          this.getEmpresa(payload.id_empresa,payload.id_usuario);
         }
      }
    }
  }


  getEmpresa(id_empresa: number,id_usuario:number) {
    this.inscricaoEmpresa = this.empresasServices
      .getEmpresa(id_empresa)
      .subscribe({
        next: (data: EmpresaModel) => {
           this.globalService.setEmpresa(data);
           this.getUsuario(id_empresa,id_usuario);
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas Com A Empresa ${messageError(error)}`,
            'OK'
          );
      }
  });
  }


  getUsuario(id_empresa: number, id_usuario:number) {
    this.inscricaoUsuario = this.usuariosService
      .getUsuario(id_empresa,id_usuario)
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

        this.globalService.setUsuario(new UsuarioModel);
        this.globalService.setLogado(false);
      }
    });
  }

  getLogin(id_empresa: number, id_usuario: number, senha: string) {
    const par = {
      id_empresa: id_empresa,
      codigo: id_usuario,
      password: senha
    }
    this.inscricaoLogin = this.loginSrv
      .login(par)
      .subscribe({
        next: (data: any) => {
          this.localStorageSrv.setString('Token', data.accessToken);
          this.getEmpresa(data.id_empresa,data.id);
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas Com O Login`,
            'OK'
          );
        }
      })
  }


  onValidar() {
    const id_usuario = this.formulario.value.id;
    const senha = this.formulario.value.senha;
    this.getLogin(1, id_usuario, senha);
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

  getPayloadData(token:string) : PayLoadModel | null {
  try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const retorno : PayLoadModel = new PayLoadModel();

      retorno.id_empresa =  payload.id_empresa;
      retorno.id_usuario = payload.id_usuario;

      return retorno ;
  } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    return null;
  }
}

}




