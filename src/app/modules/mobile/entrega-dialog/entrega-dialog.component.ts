import { GlobalService } from './../../../services/global.service';
import { Component, Inject, ViewChild } from '@angular/core';
import { EntregaDialogData } from './entrega-dialog-data';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { EntregaModel } from '../../../models/entrega-model';
import { Subscription } from 'rxjs';
import { EntregaService } from '../../../services/entrega.service';
import { ParametroEntrega01 } from '../../../parametros/parametro-entrega01';
import { finalize } from 'rxjs';
import { DataYYYYMMDD, messageError } from '../../../shared/classes/util';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { ConfirmDialogService } from '../../../services/ConfirmDialog.service';

@Component({
  selector: 'app-entrega-dialog',
  templateUrl: './entrega-dialog.component.html',
  styleUrl: './entrega-dialog.component.scss',
})
export class EntregaDialogComponent {
  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  formulario: FormGroup;

  inscricaoEntrega!: Subscription;

  botaoExcluir: boolean = false;

  acao: CadastroAcoes = CadastroAcoes.Consulta;

  constructor(
    private formBuilder: FormBuilder,
    private appSnackBar: AppSnackbar,
    private entregaSrv: EntregaService,
    private globalService: GlobalService,
    public dialogRef: MatDialogRef<EntregaDialogComponent>,
    private confirmDialog: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA) public data: EntregaDialogData,
  ) {
    this.formulario = formBuilder.group({
      nome_retirada: [{ value: '' }, [ValidatorStringLen(3, 60, true)]],
      rg_retirada: [{ value: '' }, [ValidatorStringLen(3, 11, true)]],
      tam_camisa: [{ value: '' }, [ValidatorStringLen(1, 10, true)]],
    });
  }

  ngOnInit() {
    this.setValueNoParam();
    this.getEntrega();
  }

  ngOnDestroy(): void {
    this.inscricaoEntrega?.unsubscribe();
  }

  getEntrega() {
    this.inscricaoEntrega = this.entregaSrv
      .getEntrega(
        this.data.dado.id_empresa,
        this.data.dado.id_evento,
        this.data.dado.id_inscrito,
      )
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: EntregaModel) => {
          this.botaoExcluir = true;
          this.data.entrega = data;
          this.acao = CadastroAcoes.Edicao;
          console.log('Edicao');
          this.setValue();
        },
        error: (error: any) => {
          console.log('Erro: ', error.status);
          if (error.status && error.status == 409) {
            this.botaoExcluir = false;
            const dataAtual: Date = new Date();
            this.data.entrega = new EntregaModel();
            this.data.entrega.id_empresa = this.data.dado.id_empresa;
            this.data.entrega.id_evento = this.data.dado.id_evento;
            this.data.entrega.id_inscrito = this.data.dado.id_inscrito;
            this.data.entrega.data_retirada = DataYYYYMMDD(dataAtual);
            this.acao = CadastroAcoes.Inclusao;
            console.log('Inclusão');
            this.setValue();
          } else {
            this.appSnackBar.openFailureSnackBar(
              `Erro Na Pesquisa Das Entregas ${messageError(error)}`,
              'OK',
            );
            this.closeModal();
          }
        },
      });
  }

  insertEntrega() {
    console.log('Fazendo Insert', this.data.entrega);
    this.inscricaoEntrega = this.entregaSrv
      .entregaInsert(this.data.entrega)
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: EntregaModel) => {
          this.data.entrega = data;
          this.appSnackBar.openSuccessSnackBar(
            `Kit Retirado Com Sucesso`,
            'OK',
          );
          this.data.processar = true;
          this.closeModal();
        },
        error: (error: any) => {
          console.log(error);
          this.appSnackBar.openFailureSnackBar(
            `Falha Na Inclusão Da entrega Do Kit ${messageError(error)}`,
            'OK',
          );
        },
      });
  }

  updatetEntrega() {
    console.log('Fazendo Update', this.data.entrega);
    this.inscricaoEntrega = this.entregaSrv
      .entregaUpdate(this.data.entrega)
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: EntregaModel) => {
          this.data.entrega = data;
          this.appSnackBar.openSuccessSnackBar(
            `Kit Retirado Com Sucesso`,
            'OK',
          );
          this.data.processar = true;
          this.closeModal();
        },
        error: (error: any) => {
          console.log(error);
          this.data.entrega = new EntregaModel();
          this.appSnackBar.openFailureSnackBar(
            `Falha Na Alteração Da entrega Do Kit ${messageError(error)}`,
            'OK',
          );
        },
      });
  }

  deleteEntrega() {
    this.inscricaoEntrega = this.entregaSrv
      .entregaDelete(
        this.data.dado.id_empresa,
        this.data.dado.id_evento,
        this.data.dado.id_inscrito,
      )
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: any) => {
          this.data.entrega = new EntregaModel();
          this.appSnackBar.openSuccessSnackBar(
            `Kit Excluido Com Sucesso`,
            'OK',
          );
          this.data.processar = true;
          this.closeModal();
        },
        error: (error: any) => {
          console.log(error);
          this.appSnackBar.openFailureSnackBar(
            `Falha Na Inclusão Da entrega Do Kit ${messageError(error)}`,
            'OK',
          );
        },
      });
  }
  setValue() {
    this.formulario.setValue({
      rg_retirada: this.data.entrega.rg_retirada,
      nome_retirada: this.data.entrega.nome_retirada,
      tam_camisa: this.data.entrega.tam_camisa,
    });
  }

  setValueNoParam() {
    this.formulario.setValue({
      rg_retirada: '',
      nome_retirada: '',
      tam_camisa: '',
    });
  }

  onSetarOMesmo() {
    this.formulario.patchValue({
      rg_retirada: 'O MESMO',
      nome_retirada: 'O MESMO',
    });
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

  hasValue(campo: string): boolean {
    if (this.formulario.get(campo)?.value == '') {
      return false;
    }
    return true;
  }

  closeModal() {
    this.dialogRef.close(this.data);
  }

  onProcessar() {
    if (this.formulario.valid) {
      console.log('acao', this.acao);
      this.data.entrega.rg_retirada =
        this.formulario.value?.rg_retirada.toUpperCase();
      this.data.entrega.nome_retirada =
        this.formulario.value?.nome_retirada.toUpperCase();
      this.data.entrega.tam_camisa =
        this.formulario.value?.tam_camisa.toUpperCase();
      if (this.acao == CadastroAcoes.Inclusao) {
        this.data.entrega.user_insert = this.globalService.getUsuario().id;
        this.insertEntrega();
      } else {
        const dataAtual: Date = new Date();
        this.data.entrega.data_retirada = DataYYYYMMDD(dataAtual);
        this.data.entrega.user_update = this.globalService.getUsuario().id;
        this.updatetEntrega();
      }
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK',
      );
    }
  }

  onCancelar() {
    this.data.processar = false;
    this.closeModal();
  }

  onExcluir() {
    this.confirmDialog
      .open({
        title: 'Exclusão',
        message: `Deseja Realmente Excluir o Kit ?`,
        icon: 'warning',
        iconColor: 'warn',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe(async (result) => {
        if (result) {
          console.log('Vou deletar..');
          this.deleteEntrega();
        }
      });
  }

  scrollAte(event: FocusEvent) {
    const el = event.target as HTMLElement;

    setTimeout(() => {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 250);
  }
}
