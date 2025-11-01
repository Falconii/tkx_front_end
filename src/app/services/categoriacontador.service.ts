import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriacontadorModel } from '../models/categoriacontador-model';
import { ParametroCategoriacontador01 } from '../parametros/parametro-categoriacontador01';
import { environment } from '../../environments/environment.development';

@Injectable({
providedIn: 'root',
})
export class CategoriacontadorService
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getCategoriacontadores(): Observable<CategoriacontadorModel[]> {
		return this.http.get<CategoriacontadorModel[]>(`${this.apiURL}Categoriacontadores`);
	}
	getCategoriacontadoresParametro_01(params: ParametroCategoriacontador01): Observable<CategoriacontadorModel[]> {
		return this.http.post<CategoriacontadorModel[]>(`${this.apiURL}categoriacontadores`,params);
	}
	getCategoriacontador(id_empresa:number,id_evento:number,id_categoria:number): Observable<CategoriacontadorModel> {
 		return this.http.get<CategoriacontadorModel >(`${ this.apiURL}categoriacontador/${id_empresa}/${id_evento}/${id_categoria}`);
	}
	categoriacontadorInsert(categoriacontador:CategoriacontadorModel):Observable<CategoriacontadorModel> {
		return this.http.post<CategoriacontadorModel>(`${this.apiURL}categoriacontador`, categoriacontador);
	}
	categoriacontadorUpdate(categoriacontador:CategoriacontadorModel):Observable<CategoriacontadorModel> {
		return this.http.put<CategoriacontadorModel>(`${this.apiURL}categoriacontador`,categoriacontador);
	}
	categoriacontadorDelete(id_empresa:number,id_evento:number,id_categoria:number):Observable<any>  {
 		return this.http.delete<any>(`${this.apiURL}categoriacontador/${id_empresa}/${id_evento}/${id_categoria}`);
	}
}
