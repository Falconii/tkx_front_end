import { EventoComplementarService } from './../../../services/eventoComplementar.service';
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
import { Entregav2Service } from '../../../services/entregav2.service';
import { Entregav2Model } from '../../../models/entregav2-model';
import { EntregaV2DialogData } from './entrega-v2-dialog-data';
import { Participantev2Service } from '../../../services/participantev2.service';
import { Entregasv2ComplementarService } from '../../../services/entregasv2Complementar.service';
import { EntregaparticipanteModel } from '../../../models/entregaparticipante-model';

@Component({
  selector: 'app-entrega-dialog',
  templateUrl: './entrega-dialog.component.html',
  styleUrl: './entrega-dialog.component.scss',
})
export class EntregaDialogComponent {
  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  formulario: FormGroup;

  inscricaoEntrega!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoParticipante!: Subscription;

  acao: CadastroAcoes = CadastroAcoes.Consulta;

  showSpin: boolean = false;

  isAtualizado:boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private appSnackBar: AppSnackbar,
    private entregaSrv: Entregav2Service,
    private participanteSrv: Participantev2Service,
    private entregaComplementarSrv: Entregasv2ComplementarService,
    private globalService: GlobalService,
    public dialogRef: MatDialogRef<EntregaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntregaV2DialogData,
  ) {
    this.formulario = formBuilder.group({
      nome_retirada: [{ value: '' }, [ValidatorStringLen(3, 60, true)]],
      rg_retirada: [{ value: '' }, [ValidatorStringLen(3, 11, true)]],
      tam_camisa: [{ value: '' }, [ValidatorStringLen(1, 10, true)]],
    });
    this.globalService.showSpin$.subscribe((show) => {
      this.showSpin = show;
    });
  }

  ngOnInit() {
    this.setValueNoParam();
    this.getEntrega();
  }

  ngOnDestroy(): void {
    this.inscricaoEntrega?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoParticipante?.unsubscribe();
  }

  getEntrega() {
    this.inscricaoEntrega = this.entregaSrv
      .getEntregav2(
        this.data.participantev2.id_empresa,
        this.data.participantev2.id_evento,
        this.data.participantev2.id_entrega,
      )
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: Entregav2Model) => {
          this.data.entregav2 = data;
          this.acao = CadastroAcoes.Edicao;
          console.log('Edicao');
          this.setValue();
        },
        error: (error: any) => {
          console.log('Erro: ', error.status);
          if (error.status && error.status == 409) {
            const dataAtual: Date = new Date();
            this.data.entregav2 = new Entregav2Model();
            this.data.entregav2.id_empresa = this.data.participantev2.id_empresa;
            this.data.entregav2.id_evento = this.data.participantev2.id_evento;
            this.data.entregav2.id = 0;
            this.data.entregav2.data_retirada = DataYYYYMMDD(dataAtual);
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


  gravar(){
    if (this.data.entregav2.id == 0){
      this.data.entregav2.user_insert = this.globalService.getUsuario().id;
    }
    this.data.entregav2.user_update = this.data.entregav2.id >  0 ?  this.globalService.getUsuario().id : 0 ;
    this.inscricaoAcao = this.entregaComplementarSrv.insertentregaparticipante(this.data.participantev2.id,this.data.entregav2)
      .subscribe({
        next: (data: EntregaparticipanteModel) => {
          this.data.participantev2 = data.Participantev2;
          this.data.entregav2 = data.Entregav2;
          this.data.processar = true;
          this.closeModal();
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK',
          );
        },
      });

  }



  setValue() {
    this.formulario.setValue({
      rg_retirada: this.data.entregav2.rg_retirada,
      nome_retirada: this.data.entregav2.nome_retirada,
      tam_camisa: this.data.entregav2.tam_camisa,
    });
    this.isAtualizado = true;
  }


  getParticipante() {
    this.data.participantev2.user_update = this.globalService.getUsuario().id;
    this.inscricaoParticipante = this.participanteSrv
      .getParticipantev2(
        this.data.participantev2.id_empresa,
        this.data.participantev2.id_evento,
        this.data.participantev2.id,
      )
      .subscribe({
        next: (data: any) => {
          this.data.participantev2 = data;
          this.data.processar = true;
          this.closeModal();
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Erro No Lançamento Do Kit ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
            'OK',
          );
        },
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
    if (this.showSpin){
      return;
    }
    if (this.formulario.valid) {
      console.log('acao', this.acao);
      this.data.entregav2.rg_retirada =
        this.formulario.value?.rg_retirada.toUpperCase();
      this.data.entregav2.nome_retirada =
        this.formulario.value?.nome_retirada.toUpperCase();
      this.data.entregav2.tam_camisa =
        this.formulario.value?.tam_camisa.toUpperCase();
      this.gravar();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK',
      );
    }
  }

  onCancelar() {
    if (this.showSpin){
      return;
    }
    this.data.processar = false;
    this.closeModal();
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
