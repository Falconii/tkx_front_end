import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogConfig } from '../shared/components/confirm-dialog/confirm-dialog-config.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  open(config: ConfirmDialogConfig): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: config.width || '380px',
      data: {
        title: config.title || 'Confirmação',
        message: config.message || 'Tem certeza que deseja continuar?',
        confirmText: config.confirmText || 'Confirmar',
        cancelText: config.cancelText || 'Cancelar',
        icone: config.icon || 'warning',
        iconColor: config.iconColor || 'warn',
      },
    });

    return dialogRef.afterClosed();
  }
}
