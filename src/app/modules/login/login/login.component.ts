import { loginService } from './../../../services/login.service';
import { EmpresaModel } from './../../../models/empresa-model';
import { Component, EventEmitter, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import { ConfirmDialogService } from '../../../services/ConfirmDialog.service';
import { UsuarioTrocaSenhaDialogComponent } from '../../usuario/usuario-troca-senha-dialog/usuario-troca-senha-dialog.component';
import { Usuariotrocasenhadata } from '../../usuario/usuario-troca-senha-dialog/usuariotrocasenhadata';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { ValidatorCnpjCpf } from '../../../shared/Validators/validator-Cnpj-Cpf';

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
  inscricaoReset!: Subscription;

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
    private confirmDialog: ConfirmDialogService,
    private usuarioTrocaSenha: MatDialog,
  ) {
    this.formulario = this.formulario = formBuilder.group({
      cnpj_cpf: [{ value: '' }, [ValidatorCnpjCpf(true)]],
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
    this.inscricaoReset?.unsubscribe();
  }

  setValue() {
    this.formulario.setValue({
      cnpj_cpf: this.globalService.getUsuario().cnpj_cpf ,
      senha: '',
    });
  }

  setValueNoParam() {
    this.formulario.setValue({
      cnpj_cpf: '',
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

  getEmpresa(id_empresa: number , id_usuario: number) {
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
          this.appSnackBar.openFailureSnackBar(
            `Problemas Com A Empresa ${messageError(error)}`,
            'OK',
          );
        },
      });
  }

  getUsuario(id_empresa:number, id_usuario: number) {
    this.inscricaoUsuario = this.usuariosService
      .getUsuario(id_empresa, id_usuario)
      .subscribe({
        next: (data: UsuarioModel) => {
          this.globalService.setUsuario(data);
          this.globalService.setLogado(true);
          if (data.trocarsenha == "S"){
            this.onAlterarSenha();
          }
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

  getLoginbycpf(id_empresa: number, cnpj_cpf: string, senha: string) {
    const par = {
      id_empresa: id_empresa,
      cnpj_cpf: cnpj_cpf,
      password: senha,
    };
    this.inscricaoLogin = this.loginSrv.loginByCnpjCpf(par).subscribe({
      next: (data: any) => {
        this.localStorageSrv.setString('Token', data.accessToken);
        this.getEmpresa(id_empresa, data.id);
      },
      error: (error: any) => {
        this.globalService.setOnSubmit(false);
        this.appSnackBar.openFailureSnackBar(
          `Acesso Não Autorizado`,
          'OK',
        );
      },
    });
  }

  onValidar() {
    if (this.formulario.valid) {
      if (this.globalService.getEmpresa().id <= 0) {
        const empresa = new EmpresaModel();
        empresa.id = 1;
        this.globalService.setEmpresa(empresa);
      }
      this.globalService.setOnSubmit(true);
      const cnpj_cpf = this.formulario.value.cnpj_cpf;
      const senha = this.formulario.value.senha;
      this.getLoginbycpf(this.globalService.getEmpresa().id, cnpj_cpf, senha);
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }

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



  getEvento(id_empresa: number = 1) {
    const par: ParametroEvento01 = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;
    par.status = '1';
    par.contador = 'N';

    this.inscricaoEvento = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: EventoModel[]) => {
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Nenhum Evento Encontrado! ${messageError(error)}`,
            'OK',
          );
        },
      });
  }

  onEsqueceu(): void {

    const cpf  = this.formulario.value.cnpj_cpf;

    this.confirmDialog
      .open({
        title: 'Resetar Senha',
        message: `Deseja Realmente Resetar A Senha`,
        icon: 'warning',
        iconColor: 'warn',
        confirmText: 'Resetar',
        cancelText: 'Cancelar',
      })
      .subscribe(async (result) => {
        if (result) {
          this.resetar(1, cpf);
        }
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
      return null;
    }
  }

  resetar(id_empresa: number, cpf: string) {
    const par = {
      id_empresa: id_empresa,
      cpf: cpf,
    };
    this.inscricaoReset = this.loginSrv.esqueceuSenhaCpf(par).subscribe({
      next: (data: any) => {
        this.appSnackBar.openSuccessSnackBar(data.message, 'OK');
      },
      error: (error: any) => {
        this.appSnackBar.openFailureSnackBar(`Falha Na Geração Do Email`, 'OK');
      },
    });
  }

   onAlterarSenha() {
      this.openTrocaSenhaDialog(
        CadastroAcoes.Edicao,
        this.globalService.getUsuario(),
      );
    }

   openTrocaSenhaDialog(
      opcao: CadastroAcoes = CadastroAcoes.Edicao,
      usuario: UsuarioModel,
    ): void {
      const data: Usuariotrocasenhadata = new Usuariotrocasenhadata();

      if (usuario == null) {
        return;
      }
      data.opcao = opcao;
      data.processar = false;
      data.usuario = usuario;
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.id = 'crud-usuario';
      dialogConfig.width = '60vw';
      dialogConfig.height = '65vh';
      dialogConfig.disableClose = true;
      dialogConfig.data = data;
      const modalDialog = this.usuarioTrocaSenha
        .open(UsuarioTrocaSenhaDialogComponent, dialogConfig)
        .beforeClosed()
        .subscribe((data: Usuariotrocasenhadata | null) => {
          if (data?.trocasenha) {
            this.globalService.usuario.trocarsenha = 'N';
            this.appSnackBar.openSuccessSnackBar(
              `Senha Atualizada Com Sucesso !`,
              'OK',
            );
          }
          if (data?.cancelar) {
            this.appSnackBar.openWarningnackBar(
              `Operação Cancelada Pelo Usuário.`,
              'OK',
            );
          }
        });
    }

}
