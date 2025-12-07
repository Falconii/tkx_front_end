import { EventoService } from './../../../services/evento.service';
import { EventoDialogData } from './EventoDialogData';
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
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { EventoModel } from '../../../models/evento-model';
import { ParametroUsuario01 } from '../../../parametros/parametro-usuario01';

@Component({
  selector: 'app-evento-dialog',
  templateUrl: './evento-dialog.component.html',
  styleUrl: './evento-dialog.component.scss',
})
export class EventoDialogComponent {
  formulario: FormGroup;

  responsaveis: UsuarioModel[] = [];

  ufs: EstadoModel[] = [];

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoUsuario!: Subscription;
  inscricaoEvento!: Subscription;
  inscricaoAcao!: Subscription;

  labelCadastro: string = '';

  estadoSrv: EstadoService = new EstadoService();

  constructor(
    private formBuilder: FormBuilder,
    private respSrv: UsuarioService,
    private eventoSrv: EventoService,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar,
    private simNaoPipe: SimNaoPipe,
    @Inject(MAT_DIALOG_DATA) public data: EventoDialogData,
    private dialogRef: MatDialogRef<EventoDialogComponent>
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      inicio: [{ value: '' }, [ValidatorDate(true)]],
      final: [{ value: '' }, [ValidatorDate(true)]],
      descricao: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      id_responsavel: [{ value: '' }],
      responsaveis_: [{ value: '' }],
      rua: [{ value: '' }, [ValidatorStringLen(3, 80, false)]],
      nro: [{ value: '' }, [ValidatorStringLen(1, 10, false)]],
      complemento: [{ value: '' }, [ValidatorStringLen(0, 30)]],
      bairro: [{ value: '' }, [ValidatorStringLen(3, 40, false)]],
      cidade: [{ value: '' }, [ValidatorStringLen(3, 40, false)]],
      uf: [{ value: '' }, [ValidatorStringLen(2, 2, false)]],
      uf_: [{ value: '' }],
    });
    this.ufs = this.estadoSrv.getEstados();
    this.getResponsaveis();
  }

  ngOnInit(): void {
    this.idAcao = this.data.opcao;
    this.setAcao(this.data.opcao);
  }

  ngOnDestroy(): void {
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoEvento?.unsubscribe();
    this.inscricaoUsuario?.unsubscribe();
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

  getEvento(evento: EventoModel) {
    let par = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    this.inscricaoUsuario = this.eventoSrv
      .getEvento(evento.id_empresa, evento.id)
      .subscribe({
        next: (data: EventoModel) => {
          this.data.evento = data;
          this.closeModal;
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas na Atualização Dos Eventos`,
            'OK'
          );
          this.closeModal;
        },
      });
  }

  getResponsaveis() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.globalService.getEmpresa().id;

    this.inscricaoUsuario = this.respSrv
      .getUsuariosParametro_01(par)
      .subscribe({
        next: (data: any) => {
          this.responsaveis = data;
          this.setValue();
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Falha Na Consulta Do Usuário ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK'
          );
        },
      });
  }

  setValue() {
    this.formulario.setValue({
      id: this.data.evento.id,
      status: this.simNaoPipe.transform(this.data.evento.status),
      inicio: this.data.evento.inicio,
      final: this.data.evento.final,
      descricao: this.data.evento.descricao,
      id_responsavel: this.data.evento.id_responsavel,
      responsaveis_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.data.evento.usuario_razao
          : '',
      rua: this.data.evento.rua,
      nro: this.data.evento.nro,
      complemento: this.data.evento.complemento,
      bairro: this.data.evento.bairro,
      cidade: this.data.evento.cidade,
      uf: this.data.evento.uf,
      uf_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.data.evento.uf
          : '',
      cep: this.data.evento.cep,
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
        this.labelCadastro = 'Eventos - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Eventos - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Eventos - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Eventos - Exclusão.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Atualizacao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Eventos - Atualização';
        this.readOnly = false;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.data.evento.descricao = this.formulario.value.razao.toUpperCase();
    this.data.evento.inicio = this.formulario.value.inicio;
    this.data.evento.final = this.formulario.value.final;
    this.data.evento.status = this.formulario.value.status;
    this.data.evento.id_responsavel = this.formulario.value.id_responsavel;
    this.data.evento.rua = this.formulario.value.rua.toUpperCase();
    this.data.evento.nro = this.formulario.value.nro;
    this.data.evento.complemento =
      this.formulario.value.complemento.toUpperCase();
    this.data.evento.bairro = this.formulario.value.bairro.toUpperCase();
    this.data.evento.cidade = this.formulario.value.cidade.toUpperCase();
    this.data.evento.uf = this.formulario.value.uf;
    this.data.evento.cep = this.formulario.value.cep;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.data.evento.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.eventoSrv
          .eventoInsert(this.data.evento)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Usuário Incluido Com Sucesso !`,
                'OK'
              );
              this.data.evento = data;
              this.getEvento(this.data.evento);
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
        this.data.evento.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.eventoSrv
          .eventoUpdate(this.data.evento)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Usuário Alterado Com Sucesso !`,
                'OK'
              );
              this.data.evento = data;

              this.getEvento(this.data.evento);
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
        this.inscricaoAcao = this.eventoSrv
          .eventoDelete(this.data.evento.id_empresa, this.data.evento.id)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Usuário Excluido Com Sucesso !`,
                'OK'
              );
              this.data.evento = data;
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
}
