import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CabplanilhaModel } from '../../../models/cabplanilha-model';
import { CabplanilhaService } from '../../../services/cabplanilha.service';
import { ProcessaPlanilhaDialogData } from './processa-planilha-dialog-data';
import { CabplanilhaComplementarService } from '../../../services/cabplanilhaComplementar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { ImportacaoService } from '../../../services/importacao.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { Importplanilhadata } from '../import-planilha-dialog/importplanilha-data';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { ParametroCabplanilha01 } from '../../../parametros/parametro-cabplanilha01';
import { messageError } from '../../../shared/classes/util';
import { ProcessaPlanilhaModel } from '../../../models/processa-planilha-model';

@Component({
  selector: 'app-processa-planilha-dialog',
  templateUrl: './processa-planilha-dialog.component.html',
  styleUrl: './processa-planilha-dialog.component.css',
})
export class ProcessaPlanilhaDialogComponent {
  acao: string = 'Sem Definição';

  inscricaoAcao!: Subscription;
  inscricaoStatus!: Subscription;

  labelCadastro: string = '';

  formulario!: FormGroup;

  selectedFile: File | null = null;

  lsPlanilhas: CabplanilhaModel[] = [];


  emProcessamento: boolean = false;

  foiProcessada: boolean = false;

  processaPlanilha:ProcessaPlanilhaModel = new ProcessaPlanilhaModel();

  constructor(
    private planilhaSrv: CabplanilhaService,
    private globalService: GlobalService,
    private importacaoSrv: ImportacaoService,
    private cabPlanilhaSrv: CabplanilhaComplementarService,
    @Inject(MAT_DIALOG_DATA) public data: ProcessaPlanilhaDialogData,
    private dialogRef: MatDialogRef<ProcessaPlanilhaDialogData>,
    private formBuilder: FormBuilder,
    private router: Router,
    private appSnackBar: AppSnackbar,
  ) {
    this.formulario = formBuilder.group({
      planilha: [{ value: '' }, [Validators.required]],
    });
    this.setValue();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoStatus?.unsubscribe();
  }

  setValue() {
    this.formulario.setValue({
      planilha: this.data.planilha.arquivo,
    });
  }

  onExecucao() {
    this.processarPlanilha();
  }

  closeModal() {
    this.dialogRef.close(this.data);
  }

  onCancelar() {}


  processarPlanilha() {
    const par = {
      id_empresa: this.data.planilha.id_empresa,
      id_evento: this.data.planilha.id_evento,
      id_planilha: this.data.planilha.id,
    };

    this.emProcessamento = true;

    this.inscricaoAcao = this.importacaoSrv.processaPlanilha(par).subscribe({
      next: (data: any) => {
        this.processaPlanilha = data.cabec;
        console.log('Processamento Iniciado Com Sucesso:', this.processaPlanilha.arquivo);
        this.appSnackBar.openSuccessSnackBar(
          `Processamento Iniciado Com Sucesso.`,
          'OK',
        );
        this.emProcessamento = false;
        this.foiProcessada = true;
        this.data.processar = true;
      },
      error: (err) => {
        this.emProcessamento = false;
        this.foiProcessada = true;
        this.appSnackBar.openFailureSnackBar(
          `Falha No Processamento: ${messageError(err)}`,
          'OK',
        );

      },
    });
  }
}
