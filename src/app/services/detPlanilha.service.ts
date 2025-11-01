import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetplanilhaModel } from '../models/detPlanilha-model';
import { ParametroDetplanilha01 } from '../parametros/parametro-detPlanilha01';
import { environment } from '../../environments/environment.development';

@Injectable({
providedIn: 'root',
})
export class DetplanilhaService
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getDetplanilhas(): Observable<DetplanilhaModel[]> {
		return this.http.get<DetplanilhaModel[]>(`${this.apiURL}Detplanilhas`);
	}
	getDetplanilhasParametro_01(params: ParametroDetplanilha01): Observable<DetplanilhaModel[]> {
		return this.http.post<DetplanilhaModel[]>(`${this.apiURL}detPlanilhas`,params);
	}
	getDetplanilha(id_empresa:number,id_evento:number,id_cabec:number,cnpj_cpf:string,inscricao:number): Observable<DetplanilhaModel> {
 		return this.http.get<DetplanilhaModel >(`${ this.apiURL}detPlanilha/${id_empresa}/${id_evento}/${id_cabec}/${cnpj_cpf}/${inscricao}`);
	}
	detPlanilhaInsert(detPlanilha:DetplanilhaModel):Observable<DetplanilhaModel> {
		return this.http.post<DetplanilhaModel>(`${this.apiURL}detPlanilha`, detPlanilha);
	}
	detPlanilhaUpdate(detPlanilha:DetplanilhaModel):Observable<DetplanilhaModel> {
		return this.http.put<DetplanilhaModel>(`${this.apiURL}detPlanilha`,detPlanilha);
	}
	detPlanilhaDelete(id_empresa:number,id_evento:number,id_cabec:number,cnpj_cpf:string,inscricao:number):Observable<any>  {
 		return this.http.delete<any>(`${this.apiURL}detPlanilha/${id_empresa}/${id_evento}/${id_cabec}/${cnpj_cpf}/${inscricao}`);
	}
}
