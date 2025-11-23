import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpresaModel } from '../models/empresa-model';
import { ParametroEmpresa01 } from '../parametros/parametro-empresa01';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}
  getEmpresas(): Observable<EmpresaModel[]> {
    const url = new URL('empresa/empresas', this.apiURL).toString();
    return this.http.get<EmpresaModel[]>(url);
  }
  getEmpresasParametro_01(
    params: ParametroEmpresa01
  ): Observable<EmpresaModel[]> {
    const url = new URL('empresa/empresas', this.apiURL).toString();
    return this.http.post<EmpresaModel[]>(url, params);
  }
  getEmpresa(id: number): Observable<EmpresaModel> {
    const url = new URL('empresa', this.apiURL).toString();
    return this.http.get<EmpresaModel>(`${url}/${id}`);
  }
  empresaInsert(empresa: EmpresaModel): Observable<EmpresaModel> {
    const url = new URL('empresa', this.apiURL).toString();
    return this.http.post<EmpresaModel>(url, empresa);
  }
  empresaUpdate(empresa: EmpresaModel): Observable<EmpresaModel> {
    const url = new URL('empresa', this.apiURL).toString();
    return this.http.put<EmpresaModel>(url, empresa);
  }
  empresaDelete(id: number): Observable<any> {
    const url = new URL('empresa', this.apiURL).toString();
    return this.http.delete<any>(`${url}/${id}`);
  }
}
