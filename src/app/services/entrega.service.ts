import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { EntregaModel } from '../models/entrega-model';
import { ParametroEntrega01 } from '../parametros/parametro-entrega01';

@Injectable({
providedIn: 'root',
})
export class EntregaService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getEntregas(): Observable<EntregaModel[]> {
	const url = new URL('entrega/entregas', this.apiURL).toString();
		return this.http.get<EntregaModel[]>(`${url}`);
	}
	getEntregasParametro_01(params: ParametroEntrega01): Observable<EntregaModel[]> {
	const url = new URL('entrega/entregas', this.apiURL).toString();
		return this.http.post<EntregaModel[]>(url,params);
	}
	getEntrega(id_empresa:number,id_evento:number,id:number): Observable<EntregaModel> { 
 	const url = new URL('entrega', this.apiURL).toString();
		return this.http.get<EntregaModel >(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
	entregaInsert(entrega:EntregaModel):Observable<EntregaModel> { 
	const url = new URL('entrega', this.apiURL).toString();
		return this.http.post<EntregaModel>(url, entrega);
	}
	entregaUpdate(entrega:EntregaModel):Observable<EntregaModel> { 
	const url = new URL('entrega', this.apiURL).toString();
		return this.http.put<EntregaModel>(url,entrega);
	}
	entregaDelete(id_empresa:number,id_evento:number,id:number):Observable<any>  { 
 	const url = new URL('entrega', this.apiURL).toString();
		return this.http.delete<any>(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
}