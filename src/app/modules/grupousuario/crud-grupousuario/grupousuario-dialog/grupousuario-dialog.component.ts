import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../../../../services/global.service';
import { AppSnackbar } from '../../../../shared/classes/app-snackbar';
import { ValidatorStringLen } from '../../../../shared/Validators/validator-string-len';
import { GrupoUsuarioDialogData } from './GrupoUsuarioDialogData';
import { GrupousuarioModel } from '../../../../models/grupousuario-model';
import { GrupousuarioService } from '../../../../services/grupousuario.service';
import { CadastroAcoes } from '../../../../shared/classes/cadastro-acoes';

@Component({
  selector: 'app-grupousuario-dialog',
  templateUrl: './grupousuario-dialog.component.html',
  styleUrl: './grupousuario-dialog.component.scss',
})
export class GrupousuarioDialogComponent {
  formulario: FormGroup;

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetGrupos!: Subscription;
  inscricaoAcao!: Subscription;

  labelCadastro: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private grupoSrv: GrupousuarioService,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: GrupoUsuarioDialogData,
    private dialogRef: MatDialogRef<GrupousuarioDialogComponent>
  ) {
    this.formulario = formBuilder.group({
      codigo: [{ value: '' }],
      descricao: [{ value: '' }, [ValidatorStringLen(3, 20, true)]],
    });
  }

  ngOnInit(): void {
    this.idAcao = this.data.opcao;
    this.setAcao(this.data.opcao);
    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetGrupos?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
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
      codigo: this.data.grupoUsuario.codigo,
      descricao: this.data.grupoUsuario.descricao,
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
        this.labelCadastro = 'Empresas - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Empresas - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Empresas - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Empresas - Exclusão.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Atualizacao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Empresas - Atualização';
        this.readOnly = false;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.data.grupoUsuario.codigo = this.formulario.value.codigo;
    this.data.grupoUsuario.descricao = this.formulario.value.descricao;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.data.grupoUsuario.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.grupoSrv
          .grupousuarioInsert(this.data.grupoUsuario)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Empresa Incluida Com Sucesso !`,
                'OK'
              );
              this.data.grupoUsuario = data;
              this.getGrupoUsuario(this.data.grupoUsuario);
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
        this.data.grupoUsuario.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.grupoSrv
          .grupousuarioUpdate(this.data.grupoUsuario)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Empresa Alterada Com Sucesso !`,
                'OK'
              );
              this.data.grupoUsuario = data;

              this.getGrupoUsuario(this.data.grupoUsuario);
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
        this.inscricaoAcao = this.grupoSrv
          .grupousuarioDelete(
            this.data.grupoUsuario.codigo,
            this.data.grupoUsuario.codigo
          )
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Grupo De Usuário Excluido Com Sucesso !`,
                'OK'
              );
              this.data.grupoUsuario = data;
              this.closeModal();
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Exclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
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

  getGrupoUsuario(grupo: GrupousuarioModel) {
    this.inscricaoGetGrupos = this.grupoSrv
      .getGrupousuario(grupo.id_empresa!, grupo.codigo)
      .subscribe({
        next: (data: GrupousuarioModel) => {
          this.data.grupoUsuario = data;
          this.closeModal();
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas na Consulta Da Empresa '`,
            'OK'
          );
          this.closeModal;
        },
      });
  }

  readOnlyChave(): boolean {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      return false;
    }
    return true;
  }
}
