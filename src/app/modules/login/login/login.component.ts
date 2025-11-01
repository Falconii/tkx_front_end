import { ParametroEmpresa01 } from 'src/app/parametros/parametro-empresa01';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmpresaModel } from 'src/app/models/empresa-model';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { GlobalService } from '../../../services/global.service';
import { EmpresaService } from '../../../services/empresa.service';
import { UsuarioModel } from '../../../models/usuario-model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formulario: FormGroup;
  empresas: EmpresaModel[] = [];
  inscricaoUsuario!: Subscription;
  inscricaoEmpresa!: Subscription;
  inscricaoPadrao!: Subscription;
  inscricaoEmpresas!: Subscription;
  incricaoGetLocal!: Subscription;
  inscricaoPadraoCrud!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuariosService: UsuariosService,
    private empresasServices: EmpresaService,
    private router: Router,
    private matDialog: MatDialog,
    private appSnackBar: AppSnackbar
  ) {
    this.formulario = this.formulario = formBuilder.group({
      empresa: [{ value: '' }],
      id: [{ value: '' }],
      senha: [{ value: '' }],
    });
    this.getValoresIniciais();
    this.getPadrao(false);
  }

  ngOnInit(): void {
    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoUsuario?.unsubscribe();
    this.inscricaoEmpresa?.unsubscribe();
    this.inscricaoEmpresas?.unsubscribe();
    this.inscricaoPadrao?.unsubscribe();
    this.inscricaoPadraoCrud?.unsubscribe();
  }

  setValue() {
    this.formulario.setValue({
      empresa: this.globalService.padrao.id_empresa_padrao,
      id: this.globalService.padrao.id_usuario,
      senha: this.globalService.usuario.senha,
    });
  }

  getValoresIniciais() {
    //busco valores locais
    if (false) {
    } else {
      //Valores para desenvolvimento
      this.globalService.empresa.id = 1;
      this.globalService.usuario.id_empresa = 1;
      this.globalService.usuario.id = 0;
      this.globalService.usuario.senha = '';
      this.globalService.padrao.id_empresa = 1;
      this.globalService.padrao.id_usuario = 0;
      this.globalService.padrao.id_empresa_padrao = 1;
    }
  }

  getUsuario(id: number, password: string) {
    this.globalService.setSpin(true);
    this.inscricaoUsuario = this.usuariosService
      .getUsuario(this.globalService.getIdEmpresa(), id)
      .subscribe(
        (data: UsuarioModel) => {
          this.globalService.setSpin(false);
          if (data.senha == password) {
            this.globalService.setUsuario(data);
            this.existePadrao();
          } else {
            this.appSnackBar.openFailureSnackBar(
              `Usuário Ou Senha Incorretos`,
              'OK'
            );
          }
        },
        (error: any) => {
          this.globalService.usuario = new UsuarioModel();
          this.appSnackBar.openFailureSnackBar(
            `Usuário Ou Senha Incorretos`,
            'OK'
          );
          this.globalService.setSpin(false);
        }
      );
  }

  getEmpresas() {
    let par = new ParametroEmpresa01();
    par.orderby = 'Razão';
    this.globalService.setSpin(true);
    this.inscricaoEmpresas = this.empresasServices
      .getEmpresasParametro_01(par)
      .subscribe(
        (data: EmpresaModel[]) => {
          this.empresas = data;
          this.globalService.empresa = this.empresas[0];
          this.globalService.setSpin(false);
          console.log('getEmpresas', this.globalService.getPadrao());
          this.setValue();
        },
        (error: any) => {
          console.log(error);
          this.empresas = [];
          this.globalService.setSpin(false);
          this.appSnackBar.openFailureSnackBar(
            `Pesquisa Nas Empresas ${messageError(error)}`,
            'OK'
          );
        }
      );
  }

  existePadrao() {
    this.globalService.setSpin(true);
    console.log('existPadrao - ususario', this.globalService.getUsuario());
    this.inscricaoPadrao = this.padraoService
      .getPadrao(
        this.globalService.getUsuario().id_empresa,
        this.globalService.getUsuario().id
      )
      .subscribe(
        (data: PadraoModel) => {
          this.alterPadrao(data);
        },
        (error: any) => {
          this.savePadrao();
        }
      );
  }

  getPadrao(finalizacao: boolean) {
    if (finalizacao) {
      this.globalService.setPadrao(new PadraoModel());
      this.globalService.getPadrao().id_empresa =
        this.globalService.getUsuario().id_empresa;
      this.globalService.getPadrao().id_usuario =
        this.globalService.getUsuario().id;
      this.globalService.getPadrao().id_empresa_padrao =
        this.globalService.getUsuario().id_empresa;
    }
    console.log('Pegando Padrao', this.globalService.getPadrao());
    this.globalService.setSpin(true);
    this.inscricaoPadrao = this.padraoService
      .getPadrao(
        this.globalService.getUsuario().id_empresa,
        this.globalService.getUsuario().id
      )
      .subscribe(
        (data: PadraoModel) => {
          this.globalService.setSpin(false);
          this.globalService.padrao = data;
          console.log(' getPadrao - Achei Padrao ', data);
          if (finalizacao) {
            this.globalService.setPadrao(data);
            this.globalService.setTrocaPadrao();
            this.globalService.setLogado(true);
          } else {
            this.getEmpresas();
          }
        },
        (error: any) => {
          this.globalService.setSpin(false);
          this.getValoresIniciais();
          console.log(
            ' getPadrao - Não Achei!',
            this.globalService.getPadrao()
          );
          console.log('Fsicalizacao', finalizacao);
          console.log(error);
          if (finalizacao) {
            this.savePadrao();
            this.globalService.setLogado(true);
          } else {
            this.getEmpresas();
          }
        }
      );
  }

  onValidar() {
    const id = this.formulario.value.id;
    const senha = this.formulario.value.senha;
    const idEmpresa = this.empresas.findIndex(
      (emp) => this.formulario.value.empresa == emp.id
    );
    if (idEmpresa >= 0) {
      this.getUsuario(id, senha);
    } else {
      this.appSnackBar.openWarningnackBar(`Não Encontrei A Empresa!`, 'OK');
    }
  }

  onCancelar() {
    this.router.navigate(['/']);
  }

  onSair() {
    this.globalService.setLogado(false);
    this.globalService.setUsuario(new UsuarioModel());
  }

  onEsqueceu(): void {
    this.showDialog('Ola....');
  }

  showDialog(value: string): void {
    const mensa: ProgressBarClass = new ProgressBarClass();
    mensa.labelOk = 'Continua...';
    mensa.labelCancel = 'Cancelar';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '350px';
    dialogConfig.width = '600px';
    dialogConfig.data = mensa;
    const modalDialog = this.matDialog
      .open(ProgressBarComponent, dialogConfig)
      .beforeClosed()
      .subscribe((result) => {});
  }

}
