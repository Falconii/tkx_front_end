import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
		return this.http.get<CabplanilhaModel[]>(`${this.apiURL}Cabplanilhas`);
	}
	getCabplanilhasParametro_01(params: ParametroCabplanilha01): Observable<CabplanilhaModel[]> {
		return this.http.post<CabplanilhaModel[]>(`${this.apiURL}cabplanilhas`,params);
	}
	getCabplanilha(id_empresa:number,id_evento:number,id:number): Observable<CabplanilhaModel> { 
 		return this.http.get<CabplanilhaModel >(`${ this.apiURL}cabplanilha/${id_empresa}/${id_evento}/${id}`);
	}
	cabplanilhaInsert(cabplanilha:CabplanilhaModel):Observable<CabplanilhaModel> { 
		return this.http.post<CabplanilhaModel>(`${this.apiURL}cabplanilha`, cabplanilha);
	}
	cabplanilhaUpdate(cabplanilha:CabplanilhaModel):Observable<CabplanilhaModel> { 
		return this.http.put<CabplanilhaModel>(`${this.apiURL}cabplanilha`,cabplanilha);
	}
	cabplanilhaDelete(id_empresa:number,id_evento:number,id:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}cabplanilha/${id_empresa}/${id_evento}/${id}`);
	}
}