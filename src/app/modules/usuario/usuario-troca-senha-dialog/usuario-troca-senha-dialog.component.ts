import { Component, Inject } from '@angular/core';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { SimNaoPipe } from '../../../shared/pipes/sim-nao.pipe';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { UsuarioModel } from '../../../models/usuario-model';
import { messageError } from '../../../shared/classes/util';
import { Usuariotrocasenhadata } from './usuariotrocasenhadata';

@Component({
  selector: 'app-usuario-troca-senha-dialog',
  templateUrl: './usuario-troca-senha-dialog.component.html',
  styleUrl: './usuario-troca-senha-dialog.component.scss',
})
export class UsuarioTrocaSenhaDialogComponent {
  formulario: FormGroup;
  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoAcao!: Subscription;

  labelCadastro: string = '';

  hide: boolean = true;
  hide1: boolean = true;
  hide2: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private globalService: GlobalService,
    private usuarioSrv: UsuarioService,
    private appSnackBar: AppSnackbar,
    private simNaoPipe: SimNaoPipe,
    @Inject(MAT_DIALOG_DATA) public data: Usuariotrocasenhadata,
    private dialogRef: MatDialogRef<UsuarioTrocaSenhaDialogComponent>,
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '' }],
      razao: [{ value: '' }],
      senhaantiga: [{ value: '' }, [ValidatorStringLen(6, 20, true)]],
      senha: [{ value: '' }, [ValidatorStringLen(6, 20, true)]],
      senharepetida: [{ value: '' }, [ValidatorStringLen(6, 20, true)]],
    });
  }
  ngOnInit(): void {
    this.idAcao = this.data.opcao;
    this.setAcao(this.data.opcao);
    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoAcao?.unsubscribe();
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

  closeModal() {
    this.dialogRef.close(this.data);
  }

  setValue() {
    this.formulario.setValue({
      id: this.data.usuario.id,
      razao: this.data.usuario.razao,
      senhaantiga: '',
      senha: '',
      senharepetida: '',
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
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Alteração de Senha do Usuário.';
        this.readOnly = false;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.data.usuario.senha = this.formulario.value.senha;
    const params = {
      senhaantiga: this.formulario.value.senhaantiga.trim(),
      senhanova: this.formulario.value.senha.trim(),
      senharepetida: this.formulario.value.senharepetida.trim(),
    };
    switch (+this.idAcao) {
      case CadastroAcoes.Edicao:
        this.data.usuario.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.usuarioService.updatesenha(params).subscribe({
          next: (data: any) => {
            this.appSnackBar.openSuccessSnackBar(
              `Senha Atualizada Com Sucesso !`,
              'OK',
            );
            this.data.usuario = data;
            this.data.trocasenha = true;
            this.closeModal();
          },
          error: (error: any) => {
            this.appSnackBar.openFailureSnackBar(
              messageError(
                `Erro Na Atualização De Senha  ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              ),
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

  onCancel() {
    this.data.cancelar = true;
    this.closeModal();
  }
}
