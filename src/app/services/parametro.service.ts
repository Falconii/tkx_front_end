import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametroParametro01 } from '../parametros/parametro-parametro01';
import { environment } from '../../environments/environment.development';
import { ParametroModel } from '../models/parametro-model';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getParametros(): Observable<ParametroModel[]> {
    const url = new URL('parametro/parametros', this.apiURL).toString();
    return this.http.get<ParametroModel[]>(url);
  }

  getParametrosParametro01(
    params: ParametroParametro01
  ): Observable<ParametroModel[]> {
     const url = new URL('parametro/parametros', this.apiURL).toString();
     return this.http.post<ParametroModel[]>(url, params);
  }

  getParametro(
    id_empresa: number,
    modulo: string,
    assinatura: string,
    id_usuario: number
  ) {
    const url = new URL('parametro', this.apiURL).toString();
    return this.http.get<ParametroModel>(
      `${url}${id_empresa}/${modulo}/${assinatura}/${id_usuario}`
    );
  }

  ParametroInsert(parametro: ParametroModel) {
    const url = new URL('parametro', this.apiURL).toString();
    return this.http.post<ParametroModel>(url, parametro);
  }

  ParametroUpdate(parametro: ParametroModel) {
    const url = new URL('parametro', this.apiURL).toString();
    return this.http.put<ParametroModel>(url, parametro);
  }

  ParametroAtualiza(parametro: ParametroModel) {

    const url = new URL('parametro/complementar/atualizarparametro', this.apiURL).toString();
    return this.http.post<ParametroModel>(url,parametro);
  }

  ParametroDelete(
    id_empresa: number,
    modulo: string,
    assinatura: string,
    id_usuario: number
  ) {
    const params = {
            id_empresa: id_empresa,
            modulo: modulo,
            assinatura: assinatura,
            id_usuario: id_usuario
    };

    const url = new URL('parametro/deleteparametro', this.apiURL).toString();
    return this.http.post<any>(url, params);
  }

  ParametroInstallKey(): Observable<any> {
    const url = new URL('parametro/fotokey', this.apiURL).toString();
    return this.http.post<any>(url, { chave: 'nada' });
  }
}
