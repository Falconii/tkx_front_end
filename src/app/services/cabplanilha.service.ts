import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CabplanilhaModel } from '../models/cabplanilha-model';
import { ParametroCabplanilha01 } from '../parametros/parametro-cabplanilha01';

@Injectable({
providedIn: 'root',
})
export class CabplanilhaService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getCabplanilhas(): Observable<CabplanilhaModel[]> {
	const url = new URL('cabplanilha/cabplanilhas', this.apiURL).toString();
		return this.http.get<CabplanilhaModel[]>(`${url}`);
	}
	getCabplanilhasParametro_01(params: ParametroCabplanilha01): Observable<CabplanilhaModel[]> {
	const url = new URL('cabplanilha/cabplanilhas', this.apiURL).toString();
		return this.http.post<CabplanilhaModel[]>(url,params);
	}
	getCabplanilha(id_empresa:number,id_evento:number,id:number): Observable<CabplanilhaModel> { 
 	const url = new URL('cabplanilha', this.apiURL).toString();
		return this.http.get<CabplanilhaModel >(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
	cabplanilhaInsert(cabplanilha:CabplanilhaModel):Observable<CabplanilhaModel> { 
	const url = new URL('cabplanilha', this.apiURL).toString();
		return this.http.post<CabplanilhaModel>(url, cabplanilha);
	}
	cabplanilhaUpdate(cabplanilha:CabplanilhaModel):Observable<CabplanilhaModel> { 
	const url = new URL('cabplanilha', this.apiURL).toString();
		return this.http.put<CabplanilhaModel>(url,cabplanilha);
	}
	cabplanilhaDelete(id_empresa:number,id_evento:number,id:number):Observable<any>  { 
 	const url = new URL('cabplanilha', this.apiURL).toString();
		return this.http.delete<any>(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
}