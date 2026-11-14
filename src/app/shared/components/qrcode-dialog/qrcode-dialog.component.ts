import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

/**
 * Lê um QR Code pela câmera e fecha o diálogo devolvendo o texto lido (string).
 * Fechar sem ler devolve undefined. A câmera só funciona em HTTPS (ou localhost).
 */
@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrl: './qrcode-dialog.component.css',
})
export class QrcodeDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;

  mensagem = 'Iniciando a câmera...';
  erro = false;

  private controles?: IScannerControls;
  private encerrado = false;

  constructor(private dialogRef: MatDialogRef<QrcodeDialogComponent, string>) {}

  async ngAfterViewInit() {
    if (!navigator.mediaDevices?.getUserMedia) {
      return this.falhar('Câmera indisponível. Use HTTPS e um navegador compatível.');
    }
    try {
      const leitor = new BrowserQRCodeReader();
      // câmera traseira quando existir
      const controles = await leitor.decodeFromConstraints(
        { video: { facingMode: { ideal: 'environment' } } },
        this.video.nativeElement,
        (resultado) => {
          const texto = resultado?.getText()?.trim();
          if (texto && !this.encerrado) {
            this.encerrado = true;
            this.parar();
            this.dialogRef.close(texto);
          }
        },
      );
      if (this.encerrado) controles.stop();
      else {
        this.controles = controles;
        this.mensagem = 'Aponte a câmera para o QR Code';
      }
    } catch (e: any) {
      const negada = e?.name === 'NotAllowedError' || e?.name === 'PermissionDeniedError';
      this.falhar(
        negada
          ? 'Permissão da câmera negada. Libere o acesso à câmera no navegador.'
          : 'Não foi possível acessar a câmera.',
      );
    }
  }

  ngOnDestroy(): void {
    this.parar();
  }

  fechar() {
    this.dialogRef.close();
  }

  private parar() {
    this.controles?.stop();
    this.controles = undefined;
  }

  private falhar(mensagem: string) {
    this.erro = true;
    this.mensagem = mensagem;
  }
}
