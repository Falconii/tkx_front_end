import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CategoriaModel } from '../../../models/categoria-model';
import { CategoriaService } from '../../../services/categoria.service';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { messageError } from '../../../shared/classes/util';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { CategoriaDialogData } from './CategoriaDialogData';

/** faixa do Nº do peito: 1 ou 2 dígitos (00 a 99). Os números gerados automaticamente começam em faixa x 1000. */
function validaFaixa(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = String(c.value ?? '').trim();
    return /^\d{1,2}$/.test(v)
      ? null
      : { faixa: true, message: 'Informe 1 ou 2 dígitos (00 a 99)' };
  };
}

@Component({
  selector: 'app-categoria-dialog',
  templateUrl: './categoria-dialog.component.html',
  styleUrl: './categoria-dialog.component.scss',
})
export class CategoriaDialogComponent implements OnInit, OnDestroy {
  formulario: FormGroup;

  acao: string = 'Sem Definição';
  labelCadastro: string = '';
  idAcao: number = CadastroAcoes.Inclusao;
  readOnly: boolean = true;
  gravando: boolean = false;

  inscricaoAcao!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private categoriaSrv: CategoriaService,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaDialogData,
    private dialogRef: MatDialogRef<CategoriaDialogComponent>,
  ) {
    this.formulario = formBuilder.group({
      id: [''],
      descricao: ['', [ValidatorStringLen(3, 30, true)]],
      sigla: ['', [ValidatorStringLen(1, 10, true)]],
      contador: ['', [validaFaixa()]],
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

  setValue() {
    const c = this.data.categoria;
    this.formulario.setValue({
      id: c.id ? c.id : '',
      descricao: c.descricao,
      sigla: c.sigla,
      contador: c.contador,
    });
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Categorias - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Categorias - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Categorias - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Categorias - Exclusão.';
        this.readOnly = true;
        break;
      default:
        break;
    }
  }

  /** primeiro número gerado para a faixa digitada (ex.: 90 -> 90.000) */
  get exemploFaixa(): string {
    const v = String(this.formulario.get('contador')?.value ?? '').trim();
    return /^\d{1,2}$/.test(v) ? (Number(v) * 1000).toLocaleString('pt-BR') : '';
  }

  getLabelCancel(): string {
    return this.idAcao == CadastroAcoes.Consulta ? 'Voltar' : 'Cancelar';
  }

  /** fecha informando à listagem se algo foi gravado (processar) */
  private fechar(processar: boolean) {
    this.data.processar = processar;
    this.dialogRef.close(this.data);
  }

  closeModal() {
    this.fechar(false);
  }

  actionFunction() {
    if (this.gravando) return;

    // exclusão e consulta não têm campos a validar
    const validar =
      this.idAcao == CadastroAcoes.Inclusao || this.idAcao == CadastroAcoes.Edicao;

    if (validar && !this.formulario.valid) {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openFailureSnackBar('Formulário Com Campos Inválidos.', 'OK');
      return;
    }
    this.executaAcao();
  }

  private categoriaDoFormulario(): CategoriaModel {
    const f = this.formulario.value;
    return {
      ...this.data.categoria,
      descricao: String(f.descricao ?? '').trim().toUpperCase(),
      sigla: String(f.sigla ?? '').trim().toUpperCase(),
      contador: String(f.contador ?? '').trim().padStart(2, '0'),
    };
  }

  executaAcao() {
    const usuario = this.globalService.getUsuario().id;

    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao: {
        const categoria = this.categoriaDoFormulario();
        categoria.user_insert = usuario;
        categoria.user_update = usuario;
        this.gravando = true;
        this.inscricaoAcao = this.categoriaSrv.categoriaInsert(categoria).subscribe({
          next: (registro: CategoriaModel) => {
            this.data.categoria = registro; // já vem com o id gerado
            this.appSnackBar.openSuccessSnackBar('Categoria Incluída Com Sucesso !', 'OK');
            this.fechar(true);
          },
          error: (error: any) => this.erro('Inclusão', error),
        });
        break;
      }

      case CadastroAcoes.Edicao: {
        const categoria = this.categoriaDoFormulario();
        categoria.user_update = usuario;
        this.gravando = true;
        this.inscricaoAcao = this.categoriaSrv.categoriaUpdate(categoria).subscribe({
          next: (registro: CategoriaModel) => {
            this.data.categoria = registro;
            this.appSnackBar.openSuccessSnackBar('Categoria Alterada Com Sucesso !', 'OK');
            this.fechar(true);
          },
          error: (error: any) => this.erro('Alteração', error),
        });
        break;
      }

      case CadastroAcoes.Exclusao:
        this.gravando = true;
        this.inscricaoAcao = this.categoriaSrv
          .categoriaDelete(this.data.categoria.id_empresa, this.data.categoria.id)
          .subscribe({
            next: () => {
              this.appSnackBar.openSuccessSnackBar('Categoria Excluída Com Sucesso !', 'OK');
              this.fechar(true);
            },
            error: (error: any) => this.erro('Exclusão', error),
          });
        break;

      default:
        this.closeModal(); // consulta: só volta
        break;
    }
  }

  private erro(operacao: string, error: any) {
    this.gravando = false;
    // o backend separa as mensagens das regras de negócio com "|"
    const mensagem = String(messageError(error)).replace(/\|+\s*$/, '').trim();
    this.appSnackBar.openFailureSnackBar(`Erro Na ${operacao}: ${mensagem}`, 'OK');
  }

  getAcoes() {
    return CadastroAcoes;
  }

  NoValidtouchedOrDirty(campo: string): boolean {
    const c = this.formulario.get(campo);
    return !!c && !c.valid && (c.touched || c.dirty);
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.['message'];
  }
}
