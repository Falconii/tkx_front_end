import { UsuarioDialogData } from './UsuarioDialogData';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { GrupousuarioService } from '../../../services/grupousuario.service';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { Subscription } from 'rxjs';
import { UsuarioModel } from '../../../models/usuario-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { EstadoModel } from '../../../shared/classes/EstadoModel';
import { SimNaoPipe } from '../../../shared/pipes/sim-nao.pipe';
import { ValidatorCep } from '../../../shared/Validators/validator-cep';
import { ValidatorCnpjCpf } from '../../../shared/Validators/validator-Cnpj-Cpf';
import { ValidatorDate } from '../../../shared/Validators/validator-date';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { SimNao } from '../../../shared/classes/sim-nao';
import { GrupousuarioModel } from '../../../models/grupousuario-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstadoService } from '../../../shared/classes/EstadoService';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroGrupousuario01 } from '../../../parametros/parametro-grupousuario01';
import { AtualizaParametroGrupousuario01 } from '../../../shared/classes/atualiza-parametro-grupousuario01';
import { messageError } from '../../../shared/classes/util';
import { loginService } from '../../../services/login.service';
import { ValidatorCheckBox } from '../../../shared/Validators/validator-Check-Box';
import { FormStateTracker } from '../../../shared/classes/FormStateTracker';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss'],
})
export class UsuarioDialogComponent {
  formulario: FormGroup;

  grupos: GrupousuarioModel[] = [];

  ufs: EstadoModel[] = [];

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetUsuario!: Subscription;
  inscricaoGrupousuario!: Subscription;
  inscricaoAcao!: Subscription;

  inscricaoIniciarSenha!: Subscription;

  labelCadastro: string = '';

  estadoSrv: EstadoService = new EstadoService();

  respostas: SimNao[] = [
    { sigla: 'S', descricao: 'SIM' },
    { sigla: 'N', descricao: 'NÃO' },
  ];

  cpfOuCnpjMask: string = '000.000.000-00';

  showSpin: boolean = false;

  tracker!: FormStateTracker;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private grupoUserService: GrupousuarioService,
    private globalService: GlobalService,
    private usuarioSrv: UsuarioService,
    private appSnackBar: AppSnackbar,
    private simNaoPipe: SimNaoPipe,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,

    private loginSrv: loginService,
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      ativo: [{ value: '', disabled: true }],
      razao: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cadastr: [{ value: '' }, [ValidatorDate(true)]],
      cnpj_cpf: [{ value: '' }, [ValidatorCnpjCpf(true)]],
      grupo: [{ value: '' }, [ValidatorCheckBox(1, 6, true)]],
      rua: [{ value: '' }, [ValidatorStringLen(0, 80, false)]],
      nro: [{ value: '' }, [ValidatorStringLen(0, 10, false)]],
      complemento: [{ value: '' }, [ValidatorStringLen(0, 30)]],
      bairro: [{ value: '' }, [ValidatorStringLen(0, 40, false)]],
      cidade: [{ value: '' }, [ValidatorStringLen(0, 40, false)]],
      uf: [{ value: '' }, [ValidatorStringLen(2, 2, false)]],
      cep: [{ value: '' }, [ValidatorCep(false)]],
      tel1: [{ value: '' }, [ValidatorStringLen(1, 50, false)]],
      tel2: [{ value: '' }, [ValidatorStringLen(1, 50, false)]],
      email: [{ value: '' }, [Validators.required,Validators.email]],
    });
    this.formulario.get('cnpj_cpf')?.valueChanges.subscribe((value) => {
      const digits = value?.replace(/\D/g, '') || '';
      this.cpfOuCnpjMask =
        digits.length > 11 ? '00.000.000/0000-00' : '000.000.000-00';
    });
    this.globalService.showSpin$.subscribe((show) => {
      this.showSpin = show;
    });
    this.ufs = this.estadoSrv.getEstados();
    this.setValueNoParam();
    this.getGruposUsuarios();
  }

  get grupoControl(): FormControl {
    return this.formulario.get('grupo') as FormControl;
  }

  get ufControl(): FormControl {
    return this.formulario.get('uf') as FormControl;
  }

  ngOnInit(): void {
    this.idAcao = this.data.opcao;
    this.setAcao(this.data.opcao);
  }

  ngOnDestroy(): void {
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoGetUsuario?.unsubscribe();
    this.inscricaoGrupousuario?.unsubscribe();
    this.inscricaoIniciarSenha?.unsubscribe();
  }

  actionFunction() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK',
      );
    }
  }

  onCancel() {
    this.data.processar = false;
    this.closeModal();
  }
  closeModal() {
    this.dialogRef.close(this.data);
  }

  setValue() {
    this.formulario.setValue({
      id: this.data.usuario.id,
      ativo: this.simNaoPipe.transform(this.data.usuario.ativo),
      razao: this.data.usuario.razao,
      cadastr: this.data.usuario.cadastr,
      grupo: this.data.usuario.grupo,
      cnpj_cpf: this.data.usuario.cnpj_cpf,
      rua: this.data.usuario.rua,
      nro: this.data.usuario.nro,
      complemento: this.data.usuario.complemento,
      bairro: this.data.usuario.bairro,
      cidade: this.data.usuario.cidade,
      uf: this.data.usuario.uf,
      cep: this.data.usuario.cep,
      tel1: this.data.usuario.tel1,
      tel2: this.data.usuario.tel2,
      email: this.data.usuario.email,
    });
  }

  setValueNoParam() {
    this.formulario.setValue({
      id: '',
      ativo: '',
      razao: '',
      cadastr: '',
      grupo: '',
      cnpj_cpf: '',
      rua: '',
      nro: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
      tel1: '',
      tel2: '',
      email: '',
    });
  }

  getGruposUsuarios(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroGrupousuario01();

    par.id_empresa = this.globalService.getEmpresa().id;
    par.hierarquia = this.globalService.getUsuario().grupo;

    this.inscricaoGetUsuario = this.grupoUserService
      .getGruposusuariosParametro_01(par)
      .subscribe({
        next: (data: GrupousuarioModel[]) => {
          this.grupos = data;
          this.setValue();
          this.tracker = new FormStateTracker(this.formulario, 80);
        },
        error: (error: any) => {},
      });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Usuários - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Usuários - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Usuários - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Usuários - Exclusão.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Atualizacao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Usuários - Atualização';
        this.readOnly = false;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.data.usuario.razao = this.formulario.value.razao.toUpperCase();
    this.data.usuario.cnpj_cpf = this.formulario.value.cnpj_cpf;
    this.data.usuario.cadastr = this.formulario.value.cadastr;
    this.data.usuario.rua = this.formulario.value.rua.toUpperCase();
    this.data.usuario.nro = this.formulario.value.nro.toUpperCase();
    this.data.usuario.complemento =
      this.formulario.value.complemento.toUpperCase();
    this.data.usuario.bairro = this.formulario.value.bairro.toUpperCase();
    this.data.usuario.cidade = this.formulario.value.cidade.toUpperCase();
    this.data.usuario.uf = this.formulario.value.uf;
    this.data.usuario.cep = this.formulario.value.cep;
    this.data.usuario.tel1 = this.formulario.value.tel1;
    this.data.usuario.tel2 = this.formulario.value.tel2;
    this.data.usuario.email = this.formulario.value.email;
    this.data.usuario.grupo = this.formulario.value.grupo;
    //this.usuario.ativo = this.formulario.value.ativo
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.data.usuario.ativo = 'S';
        this.data.usuario.user_insert = this.globalService.getUsuario().id;
        console.log('usuario =>', this.data.usuario);
        this.inscricaoAcao = this.usuarioService
          .usuarioInsert(this.data.usuario)
          .subscribe({
            next: (data: any) => {
              this.data.usuario = data;
              this.getUsuario(this.data.usuario, '');
            },
            error: (error: any) => {
              console.log('error =>', error);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK',
              );
            },
          });
        break;
      case CadastroAcoes.Edicao:
        this.data.usuario.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.usuarioService
          .usuarioUpdate(this.data.usuario)
          .subscribe({
            next: (data: any) => {
              this.data.usuario = data;

              this.getUsuario(
                this.data.usuario,
                `Usuário Alterado Com Sucesso !`,
              );
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK',
              );
            },
          });
        break;
      case CadastroAcoes.Atualizacao:
        this.data.usuario.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.usuarioService
          .usuarioUpdate(this.data.usuario)
          .subscribe({
            next: (data: any) => {
              this.data.usuario = data;
              this.getUsuario(
                this.data.usuario,
                `Usuário Atualizado Com Sucesso !`,
              );
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK',
              );
            },
          });
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.usuarioService
          .usuarioDelete(this.data.usuario.id_empresa, this.data.usuario.id)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Usuário Excluido Com Sucesso !`,
                'OK',
              );
              this.data.usuario = data;
              this.data.processar = true;
              this.closeModal();
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK',
              );
            },
          });
        break;
      default:
        break;
    }
  }

  getAcoes() {
    return CadastroAcoes;
  }

  NoValidtouchedOrDirty(campo: string): boolean {
    if (
      !this.formulario.get(campo)?.valid &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    ) {
      return true;
    }
    return false;
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.['message'];
  }

  setEmailReadOnly() {
    if (this.idAcao == 5) {
      return true;
    }
    return this.readOnly;
  }

  getUsuario(usuario: UsuarioModel, msg: string = 'Processo Executado!') {
    this.inscricaoGetUsuario = this.usuarioSrv
      .getUsuario(usuario.id_empresa!, usuario.id!)
      .subscribe({
        next: (data: UsuarioModel) => {
          this.data.usuario = data;
          if (this.idAcao == CadastroAcoes.Inclusao) {
            this.iniciarSenha(usuario);
          } else {
            this.appSnackBar.openSuccessSnackBar(msg, 'OK');
            this.data.processar = true;
            this.closeModal();
          }
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas na Atualização Do Usuário`,
            'OK',
          );
          this.data.processar = false;
          this.closeModal;
        },
      });
  }

  iniciarSenha(usuario: UsuarioModel) {
    const par = {
      id_empresa: usuario.id_empresa,
      id_usuario: usuario.id,
    };

    this.inscricaoIniciarSenha = this.loginSrv.zerarSenha(par).subscribe({
      next: (data: any) => {
        usuario.senha = data.senha;
        this.appSnackBar.openSuccessSnackBar('Usuário Incluído!', 'OK');
        this.data.processar = true;
        this.closeModal();
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

  isReadOnly(): boolean {
    return (
      this.idAcao === this.getAcoes().Consulta ||
      this.idAcao === this.getAcoes().Exclusao
    );
  }

  disabledSubmit() {
    // Proteção contra tracker indefinido
    if (!this.tracker) {
      return true;
    }

    if (this.showSpin) {
      return true;
    }

    if (this.idAcao == this.getAcoes().Edicao && !this.tracker.hasChanged()) {
      return true;
    }

    if (this.idAcao == this.getAcoes().Exclusao) {
      return false;
    }

    if (this.idAcao == this.getAcoes().Consulta) {
      return true;
    }

    return !this.formulario.valid;
  }
}
