import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { DetplanilhaModel } from '../models/detPlanilha-model';
import { ParametroDetplanilha01 } from '../parametros/parametro-detPlanilha01';

@Injectable({
providedIn: 'root',
})
export class DetplanilhaService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getDetplanilhas(): Observable<DetplanilhaModel[]> {
	const url = new URL('detPlanilha/detPlanilhas', this.apiURL).toString();
		return this.http.get<DetplanilhaModel[]>(`${url}`);
	}
	getDetplanilhasParametro_01(params: ParametroDetplanilha01): Observable<DetplanilhaModel[]> {
	const url = new URL('detPlanilha/detPlanilhas', this.apiURL).toString();
		return this.http.post<DetplanilhaModel[]>(url,params);
	}
	getDetplanilha(id_empresa:number,id_evento:number,id_cabec:number,nro_peito:number): Observable<DetplanilhaModel> { 
 	const url = new URL('detPlanilha', this.apiURL).toString();
		return this.http.get<DetplanilhaModel >(`${url}/${id_empresa}/${id_evento}/${id_cabec}/${nro_peito}`);
	}
	detPlanilhaInsert(detPlanilha:DetplanilhaModel):Observable<DetplanilhaModel> { 
	const url = new URL('detPlanilha', this.apiURL).toString();
		return this.http.post<DetplanilhaModel>(url, detPlanilha);
	}
	detPlanilhaUpdate(detPlanilha:DetplanilhaModel):Observable<DetplanilhaModel> { 
	const url = new URL('detPlanilha', this.apiURL).toString();
		return this.http.put<DetplanilhaModel>(url,detPlanilha);
	}
	detPlanilhaDelete(id_empresa:number,id_evento:number,id_cabec:number,nro_peito:number):Observable<any>  { 
 	const url = new URL('detPlanilha', this.apiURL).toString();
		return this.http.delete<any>(`${url}/${id_empresa}/${id_evento}/${id_cabec}/${nro_peito}`);
	}
}