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
export class PublicService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}


  liberaEvento(token: string,id_evento:number): Observable<any> {
    return this.http.post<any>(`${this.apiURL}public/liberaevento`, {
      token,
      id_evento
    });
  }

}
