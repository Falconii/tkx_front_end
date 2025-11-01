import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParametroModel } from '../models/parametro-model';
import { ParametroParametro01 } from '../parametros/parametro-parametro01';

@Injectable({
providedIn: 'root',
})
export class ParametroService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getParametros(): Observable<ParametroModel[]> {
		return this.http.get<ParametroModel[]>(`${this.apiURL}Parametros`);
	}
	getParametrosParametro_01(params: ParametroParametro01): Observable<ParametroModel[]> {
		return this.http.post<ParametroModel[]>(`${this.apiURL}parametros`,params);
	}
	getParametro(id_empresa:number,modulo:string,assinatura:string,id_usuario:number): Observable<ParametroModel> { 
 		return this.http.get<ParametroModel >(`${ this.apiURL}parametro/${id_empresa}/${modulo}/${assinatura}/${id_usuario}`);
	}
	parametroInsert(parametro:ParametroModel):Observable<ParametroModel> { 
		return this.http.post<ParametroModel>(`${this.apiURL}parametro`, parametro);
	}
	parametroUpdate(parametro:ParametroModel):Observable<ParametroModel> { 
		return this.http.put<ParametroModel>(`${this.apiURL}parametro`,parametro);
	}
	parametroDelete(id_empresa:number,modulo:string,assinatura:string,id_usuario:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}parametro/${id_empresa}/${modulo}/${assinatura}/${id_usuario}`);
	}
}