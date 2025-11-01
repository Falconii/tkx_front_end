import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaModel } from '../models/categoria-model';
import { ParametroCategoria01 } from '../parametros/parametro-categoria01';
import { environment } from '../../environments/environment.development';

@Injectable({
providedIn: 'root',
})
export class CategoriaService
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getCategorias(): Observable<CategoriaModel[]> {
		return this.http.get<CategoriaModel[]>(`${this.apiURL}Categorias`);
	}
	getCategoriasParametro_01(params: ParametroCategoria01): Observable<CategoriaModel[]> {
		return this.http.post<CategoriaModel[]>(`${this.apiURL}categorias`,params);
	}
	getCategoria(id_empresa:number,id:number): Observable<CategoriaModel> {
 		return this.http.get<CategoriaModel >(`${ this.apiURL}categoria/${id_empresa}/${id}`);
	}
	categoriaInsert(categoria:CategoriaModel):Observable<CategoriaModel> {
		return this.http.post<CategoriaModel>(`${this.apiURL}categoria`, categoria);
	}
	categoriaUpdate(categoria:CategoriaModel):Observable<CategoriaModel> {
		return this.http.put<CategoriaModel>(`${this.apiURL}categoria`,categoria);
	}
	categoriaDelete(id_empresa:number,id:number):Observable<any>  {
 		return this.http.delete<any>(`${this.apiURL}categoria/${id_empresa}/${id}`);
	}
}
