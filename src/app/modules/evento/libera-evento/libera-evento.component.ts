import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { loginService } from '../../../services/login.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { getPayloadData, isTokenExpired } from '../../../shared/classes/util';
import { EventoService } from '../../../services/evento.service';
import { PublicService } from '../../../services/public.service';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';

@Component({
  selector: 'app-libera-evento',
  templateUrl: './libera-evento.component.html',
  styleUrl: './libera-evento.component.css'
})
export class LiberaEventoComponent {

  inscricaoEvento!: Subscription;

  id_empresa;
  id_usuario;
  id_evento;
  token_valido: boolean = false;
  token: string = '';
  itsOK: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private eventoSrv:EventoService,
    private publicSrv:PublicService,
  ) {

    console.log(this.route.snapshot.queryParams);
    this.token = this.route.snapshot.queryParams['token'];
    this.id_evento = this.route.snapshot.queryParams['id_evento'];

    if (this.token != null && getPayloadData(this.token) != null && this.id_evento != null) {
      const dados = getPayloadData(this.token);
      this.id_empresa = dados?.id_empresa;
      this.id_usuario = dados?.id_usuario;

      if (this.isTokenValido()) {
          this.liberarEvento();
      } else {
        this.appSnackBar.openFailureSnackBar('TOKEN Expirado!', 'OK');
      }
    } else {
      this.appSnackBar.openFailureSnackBar('Parâmetros Inválidos', 'OK');
    }
  }

  ngOnDestroy(): void {
    this.inscricaoEvento?.unsubscribe();
  }

  isTokenValido(): boolean {
    return !isTokenExpired(this.token);
  }

  liberarEvento() {
     this.inscricaoEvento = this.publicSrv
          .liberaEvento(this.token, this.id_evento)
          .subscribe({
            next: (data: any) => {
              this.itsOK = true;
            },
            error: (error: any) => {
              console.log(error);
            },
          });
        }
  }
