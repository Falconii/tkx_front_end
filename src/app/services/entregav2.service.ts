import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Entregav2Model } from '../models/entregav2-model';
import { ParametroEntregav201 } from '../parametros/parametro-entregav201';

@Injectable({
providedIn: 'root',
})
export class Entregav2Service 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getEntregasv2(): Observable<Entregav2Model[]> {
	const url = new URL('entregav2/entregasv2', this.apiURL).toString();
		return this.http.get<Entregav2Model[]>(`${url}`);
	}
	getEntregasv2Parametro_01(params: ParametroEntregav201): Observable<Entregav2Model[]> {
	const url = new URL('entregav2/entregasv2', this.apiURL).toString();
		return this.http.post<Entregav2Model[]>(url,params);
	}
	getEntregav2(id_empresa:number,id_evento:number,id:number): Observable<Entregav2Model> { 
 	const url = new URL('entregav2', this.apiURL).toString();
		return this.http.get<Entregav2Model >(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
	entregav2Insert(entregav2:Entregav2Model):Observable<Entregav2Model> { 
	const url = new URL('entregav2', this.apiURL).toString();
		return this.http.post<Entregav2Model>(url, entregav2);
	}
	entregav2Update(entregav2:Entregav2Model):Observable<Entregav2Model> { 
	const url = new URL('entregav2', this.apiURL).toString();
		return this.http.put<Entregav2Model>(url,entregav2);
	}
	entregav2Delete(id_empresa:number,id_evento:number,id:number):Observable<any>  { 
 	const url = new URL('entregav2', this.apiURL).toString();
		return this.http.delete<any>(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
}