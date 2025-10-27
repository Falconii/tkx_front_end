import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmpresaModel } from '../models/empresa-model';
import { ParametroEmpresa01 } from '../parametros/parametro-empresa01';

@Injectable({
providedIn: 'root',
})
export class EmpresaService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getEmpresas(): Observable<EmpresaModel[]> {
		return this.http.get<EmpresaModel[]>(`${this.apiURL}Empresas`);
	}
	getEmpresasParametro_01(params: ParametroEmpresa01): Observable<EmpresaModel[]> {
		return this.http.post<EmpresaModel[]>(`${this.apiURL}empresas`,params);
	}
	getEmpresa(id:number): Observable<EmpresaModel> { 
 		return this.http.get<EmpresaModel >(`${ this.apiURL}empresa/${id}`);
	}
	empresaInsert(empresa:EmpresaModel):Observable<EmpresaModel> { 
		return this.http.post<EmpresaModel>(`${this.apiURL}empresa`, empresa);
	}
	empresaUpdate(empresa:EmpresaModel):Observable<EmpresaModel> { 
		return this.http.put<EmpresaModel>(`${this.apiURL}empresa`,empresa);
	}
	empresaDelete(id:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}empresa/${id}`);
	}
}