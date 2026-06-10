import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CredencialModel } from '../models/credencial-model';
import { ParametroCredencial01 } from '../parametros/parametro-credencial01';
import { environment } from '../../environments/environment.development';
import { LoginModel } from '../models/login-model';
import { ParametroLogin01 } from '../parametros/parametro-login01';
import { UsuarioModel } from '../models/usuario-model';

@Injectable({
  providedIn: 'root',
})
export class loginService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}

  login(params: ParametroLogin01): Observable<LoginModel> {
    return this.http.post<LoginModel>(`${this.apiURL}login`, params);
  }

  zerarSenha(params: any): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(
      `${this.apiURL}login/refreshpassword`,
      params,
    );
  }

  redefineSenha(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}login/redefinepassword`, {
      token,
    });
  }

  esqueceuSenha(params: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}login/esqueceusenha`, params);
  }
}
