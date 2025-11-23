import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupousuarioModel } from '../models/grupousuario-model';
import { ParametroGrupousuario01 } from '../parametros/parametro-grupousuario01';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GrupousuarioService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}
  getGruposusuarios(): Observable<GrupousuarioModel[]> {
    const url = new URL('grupousuario/gruposusuarios', this.apiURL).toString();
    return this.http.get<GrupousuarioModel[]>(url);
  }
  getGruposusuariosParametro_01(
    params: ParametroGrupousuario01
  ): Observable<GrupousuarioModel[]> {
    const url = new URL('grupousuario/gruposusuarios', this.apiURL).toString();
    return this.http.post<GrupousuarioModel[]>(url, params);
  }
  getGrupousuario(
    id_empresa: number,
    codigo: number
  ): Observable<GrupousuarioModel> {
    const url = new URL('grupousuario', this.apiURL).toString();
    return this.http.get<GrupousuarioModel>(`${url}/${id_empresa}/${codigo}`);
  }
  grupousuarioInsert(
    grupousuario: GrupousuarioModel
  ): Observable<GrupousuarioModel> {
    const url = new URL('grupousuario', this.apiURL).toString();
    return this.http.post<GrupousuarioModel>(url, grupousuario);
  }
  grupousuarioUpdate(
    grupousuario: GrupousuarioModel
  ): Observable<GrupousuarioModel> {
    const url = new URL('grupousuario', this.apiURL).toString();
    return this.http.put<GrupousuarioModel>(url, grupousuario);
  }
  grupousuarioDelete(id_empresa: number, codigo: number): Observable<any> {
    const url = new URL('grupousuario', this.apiURL).toString();
    return this.http.delete<any>(`${url}/${id_empresa}/${codigo}`);
  }
}
