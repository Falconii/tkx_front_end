import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { getPayloadData, isTokenExpired } from '../../../shared/classes/util';
import { UsuarioModel } from '../../../models/usuario-model';
import { loginService } from '../../../services/login.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-redefine-senha',
  templateUrl: './redefine-senha.component.html',
  styleUrl: './redefine-senha.component.css',
})
export class RedefineSenhaComponent {
  inscricaoUsuario!: Subscription;

  id_empresa;
  id_usuario;
  token_valido: boolean = false;
  token: string = '';
  itsOK: boolean = false;

  appurl = environment.appURL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private loginSrv: loginService,
  ) {
    this.token = this.route.snapshot.queryParams['token'];

    if (this.token != null && getPayloadData(this.token) != null) {
      const dados = getPayloadData(this.token);
      this.id_empresa = dados?.id_empresa;
      this.id_usuario = dados?.id_usuario;

      if (this.isTokenValido()) {
        this.trocarSenha();
      } else {
        this.appSnackBar.openFailureSnackBar('TOKEN Expirado!', 'OK');
      }
    } else {
      this.appSnackBar.openFailureSnackBar('Parâmetros Inválidos', 'OK');
    }
  }

  ngOnDestroy(): void {
    this.inscricaoUsuario?.unsubscribe();
  }

  isTokenValido(): boolean {
    return !isTokenExpired(this.token);
  }

  trocarSenha() {
    this.inscricaoUsuario = this.loginSrv.redefineSenha(this.token).subscribe({
      next: (data: any) => {
        this.itsOK = true;
        this.appSnackBar.openSuccessSnackBar(
          'Senha Resetada Com Sucesso!',
          'OK',
        );
      },
      error: (error: any) => {
        this.appSnackBar.openFailureSnackBar(
          'Falha Na Reciclagem Da Senha!',
          'OK',
        );
      },
    });
  }
}
