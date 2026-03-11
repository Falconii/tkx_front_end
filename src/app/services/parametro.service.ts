import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroModel } from '../models/parametro-model';
import { environment } from '../../environments/environment.development';
import { ParametroParametro01 } from '../parametros/parametro-parametro01';

@Injectable({
  providedIn: 'root',
})
export class ParametroService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}
  getParametros(): Observable<ParametroModel[]> {
    const url = new URL('parametro/parametros', this.apiURL).toString();
    return this.http.get<ParametroModel[]>(`${this.apiURL}Parametros`);
  }
  getParametrosParametro_01(
    params: ParametroParametro01,
  ): Observable<ParametroModel[]> {
    return this.http.post<ParametroModel[]>(`${this.apiURL}parametros`, params);
  }
  getParametro(
    id_empresa: number,
    modulo: string,
    assinatura: string,
    id_usuario: number,
  ): Observable<ParametroModel> {
    const url = new URL('parametro', this.apiURL).toString();
    return this.http.get<ParametroModel>(
      `${url}/${id_empresa}/${modulo}/${assinatura}/${id_usuario}`,
    );
  }
  parametroInsert(parametro: ParametroModel): Observable<ParametroModel> {
    const url = new URL('parametro', this.apiURL).toString();
    return this.http.post<ParametroModel>(`url,parametro`, parametro);
  }
  parametroUpdate(parametro: ParametroModel): Observable<ParametroModel> {
    const url = new URL('parametro', this.apiURL).toString();
    return this.http.put<ParametroModel>(`url,parametro`, parametro);
  }

  ParametroAtualiza(parametro: ParametroModel) {
    const url = new URL(
      'parametro/complementar/atualizarparametro',
      this.apiURL,
    ).toString();
    return this.http.post<ParametroModel>(url, parametro);
  }

  parametroDelete(
    id_empresa: number,
    modulo: string,
    assinatura: string,
    id_usuario: number,
  ): Observable<any> {
    const url = new URL('parametro', this.apiURL).toString();
    return this.http.delete<any>(
      `${url}/${id_empresa}/${modulo}/${assinatura}/${id_usuario}`,
    );
  }
}
