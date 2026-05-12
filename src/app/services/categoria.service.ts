import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CategoriaModel } from '../models/categoria-model';
import { ParametroCategoria01 } from '../parametros/parametro-categoria01';

@Injectable({
providedIn: 'root',
})
export class CategoriaService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getCategorias(): Observable<CategoriaModel[]> {
	const url = new URL('categoria/categorias', this.apiURL).toString();
		return this.http.get<CategoriaModel[]>(`${url}`);
	}
	getCategoriasParametro_01(params: ParametroCategoria01): Observable<CategoriaModel[]> {
	const url = new URL('categoria/categorias', this.apiURL).toString();
		return this.http.post<CategoriaModel[]>(url,params);
	}
	getCategoria(id_empresa:number,id:number): Observable<CategoriaModel> { 
 	const url = new URL('categoria', this.apiURL).toString();
		return this.http.get<CategoriaModel >(`${url}/${id_empresa}/${id}`);
	}
	categoriaInsert(categoria:CategoriaModel):Observable<CategoriaModel> { 
	const url = new URL('categoria', this.apiURL).toString();
		return this.http.post<CategoriaModel>(url, categoria);
	}
	categoriaUpdate(categoria:CategoriaModel):Observable<CategoriaModel> { 
	const url = new URL('categoria', this.apiURL).toString();
		return this.http.put<CategoriaModel>(url,categoria);
	}
	categoriaDelete(id_empresa:number,id:number):Observable<any>  { 
 	const url = new URL('categoria', this.apiURL).toString();
		return this.http.delete<any>(`${url}/${id_empresa}/${id}`);
	}
}