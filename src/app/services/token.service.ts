import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenModel } from '../models/token-model';
import { ParametroToken01 } from '../parametros/parametro-token01';

@Injectable({
providedIn: 'root',
})
export class TokenService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getTokens(): Observable<TokenModel[]> {
		return this.http.get<TokenModel[]>(`${this.apiURL}Tokens`);
	}
	getTokensParametro_01(params: ParametroToken01): Observable<TokenModel[]> {
		return this.http.post<TokenModel[]>(`${this.apiURL}tokens`,params);
	}
	getToken(id_empresa:number,id_usuario:number,token:string,tipo:string): Observable<TokenModel> { 
 		return this.http.get<TokenModel >(`${ this.apiURL}token/${id_empresa}/${id_usuario}/${token}/${tipo}`);
	}
	tokenInsert(token:TokenModel):Observable<TokenModel> { 
		return this.http.post<TokenModel>(`${this.apiURL}token`, token);
	}
	tokenUpdate(token:TokenModel):Observable<TokenModel> { 
		return this.http.put<TokenModel>(`${this.apiURL}token`,token);
	}
	tokenDelete(id_empresa:number,id_usuario:number,token:string,tipo:string):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}token/${id_empresa}/${id_usuario}/${token}/${tipo}`);
	}
}