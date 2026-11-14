import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from '../../../services/global.service';
import { SimNao } from '../../../shared/classes/sim-nao';
import { TrocaSituacaoDialogData } from './troca-situacao-dialog-data';

/** Situações para as quais o evento pode ser trocado: 2 StandBy | 3 Ativo | 4 Encerrado. Fecha devolvendo a situação escolhida. */
const SITUACOES_DESTINO = ['2', '3', '4'];

@Component({
  selector: 'app-troca-situacao-dialog',
  templateUrl: './troca-situacao-dialog.component.html',
  styleUrl: './troca-situacao-dialog.component.css',
})
export class TrocaSituacaoDialogComponent {
  escolhida = '';
  opcoes: SimNao[];
  situacaoAtual: string;

  constructor(
    private dialogRef: MatDialogRef<TrocaSituacaoDialogComponent, string>,
    private globalService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: TrocaSituacaoDialogData,
  ) {
    this.situacaoAtual = this.globalService.getSituacoesEventoByCodigo(this.data.evento.status).descricao;
    // a situação em que o evento já está não é opção
    this.opcoes = this.globalService
      .getSituacoesEvento()
      .filter((s) => SITUACOES_DESTINO.includes(s.sigla) && s.sigla !== this.data.evento.status);
  }

  get encerrando(): boolean {
    return this.escolhida === '4';
  }

  /** evento encerrado sendo reaberto */
  get reabrindo(): boolean {
    return this.data.evento.status === '4' && (this.escolhida === '2' || this.escolhida === '3');
  }

  cancelar() {
    this.dialogRef.close();
  }

  processar() {
    if (!this.escolhida) return;
    this.dialogRef.close(this.escolhida);
  }
}
