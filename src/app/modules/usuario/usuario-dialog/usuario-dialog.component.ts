import { UsuarioDialogData } from './UsuarioDialogData';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { Subscription } from 'rxjs';
import { UsuarioModel } from '../../../models/usuario-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
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
import { EstadoModel } from '../../../shared/classes/EstadoModel';
import { GrupousuarioService } from '../../../services/grupousuario.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

  labelCadastro: string = '';

  estadoSrv: EstadoService = new EstadoService();

  respostas: SimNao[] = [
    { sigla: 'S', descricao: 'SIM' },
    { sigla: 'N', descricao: 'NÃO' },
  ];

  cpfOuCnpjMask: string = '000.000.000-00';

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private grupoUserService: GrupousuarioService,
    private globalService: GlobalService,
    private usuarioSrv: UsuarioService,
    private appSnackBar: AppSnackbar,
    private simNaoPipe: SimNaoPipe,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      ativo: [{ value: '', disabled: true }],
      razao: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cadastr: [{ value: '' }, [ValidatorDate(true)]],
      cnpj_cpf: [{ value: '' }, [ValidatorCnpjCpf(false)]],
      senha: [{ value: '' }, [ValidatorStringLen(6, 255, false)]],
      grupo: [{ value: '' }],
      grupo_: [{ value: '' }],
      rua: [{ value: '' }, [ValidatorStringLen(3, 80, false)]],
      nro: [{ value: '' }, [ValidatorStringLen(1, 10, false)]],
      complemento: [{ value: '' }, [ValidatorStringLen(0, 30)]],
      bairro: [{ value: '' }, [ValidatorStringLen(3, 40, false)]],
      cidade: [{ value: '' }, [ValidatorStringLen(3, 40, false)]],
      uf: [{ value: '' }, [ValidatorStringLen(2, 2, false)]],
      uf_: [{ value: '' }],
      cep: [{ value: '' }, [ValidatorCep(false)]],
      tel1: [{ value: '' }, [ValidatorStringLen(0, 23, false)]],
      tel2: [{ value: '' }, [ValidatorStringLen(0, 23)]],
      email: [{ value: '' }, [Validators.required, Validators.email]],
    });
    /*  this.formulario.get('cnpj_cpf')?.valueChanges.subscribe((value) => {
      const digits = value?.replace(/\D/g, '') || '';
      this.cpfOuCnpjMask =
        digits.length > 11 ? '00.000.000/0000-00' : '000.000.000-00';
    }); */
    this.ufs = this.estadoSrv.getEstados();
    this.getGruposUsuarios();
  }

  ngOnInit(): void {
    this.idAcao = this.data.opcao;
    this.setAcao(this.data.opcao);
  }

  ngOnDestroy(): void {
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoGetUsuario?.unsubscribe();
    this.inscricaoGrupousuario?.unsubscribe();
  }

  onInputChangeCnpj_Cpf(event: any) {
    const value = event.target.value.replace(/\D/g, '');
    this.cpfOuCnpjMask =
      value.length > 11 ? '00.000.000/0000-00' : '000.000.000-00';
  }

  actionFunction() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  closeModal() {
    this.data.processar = true;
    this.dialogRef.close(this.data);
  }

  setValue() {
    this.formulario.setValue({
      id: this.data.usuario.id,
      ativo: this.simNaoPipe.transform(this.data.usuario.ativo),
      razao: this.data.usuario.razao,
      cadastr: this.data.usuario.cadastr,
      senha: this.data.usuario.senha,
      grupo: this.data.usuario.grupo,
      grupo_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.data.usuario.grupo_descricao
          : '',
      cnpj_cpf: this.data.usuario.cnpj_cpf,
      rua: this.data.usuario.rua,
      nro: this.data.usuario.nro,
      complemento: this.data.usuario.complemento,
      bairro: this.data.usuario.bairro,
      cidade: this.data.usuario.cidade,
      uf: this.data.usuario.uf,
      uf_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.data.usuario.uf
          : '',
      cep: this.data.usuario.cep,
      tel1: this.data.usuario.tel1,
      tel2: this.data.usuario.tel2,
      email: this.data.usuario.email,
    });
  }

  getGruposUsuarios(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroGrupousuario01();

    par.id_empresa = this.globalService.getEmpresa().id;

    this.inscricaoGetUsuario = this.grupoUserService
      .getGruposusuariosParametro_01(par)
      .subscribe({
        next: (data: GrupousuarioModel[]) => {
          this.grupos = data;
          this.setValue();
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
    this.data.usuario.senha = this.formulario.value.senha;
    this.data.usuario.grupo = this.formulario.value.grupo;
    //this.usuario.ativo = this.formulario.value.ativo
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.data.usuario.user_insert = this.globalService.getUsuario().id;
        console.log('usuario =>', this.data.usuario);
        this.inscricaoAcao = this.usuarioService
          .usuarioInsert(this.data.usuario)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Usuário Incluido Com Sucesso !`,
                'OK'
              );
              this.data.usuario = data;
              this.getUsuario(this.data.usuario);
            },
            error: (error: any) => {
              console.log('error =>', error);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
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
              this.appSnackBar.openSuccessSnackBar(
                `Usuário Alterado Com Sucesso !`,
                'OK'
              );
              this.data.usuario = data;

              this.getUsuario(this.data.usuario);
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
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
              this.appSnackBar.openSuccessSnackBar(
                `Usuário Alterado Com Sucesso !`,
                'OK'
              );
              this.data.usuario = data;
              this.getUsuario(this.data.usuario);
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
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
                'OK'
              );
              this.data.usuario = data;
              this.closeModal();
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
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

  getUsuario(usuario: UsuarioModel) {
    this.inscricaoGetUsuario = this.usuarioSrv
      .getUsuario(usuario.id_empresa!, usuario.id!)
      .subscribe({
        next: (data: UsuarioModel) => {
          this.data.usuario = data;
          this.closeModal();
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas na Atualização Do Usuário`,
            'OK'
          );
          this.closeModal;
        },
      });
  }
}
