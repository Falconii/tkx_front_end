import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
		return this.http.get<EntregaModel[]>(`${this.apiURL}Entregas`);
	}
	getEntregasParametro_01(params: ParametroEntrega01): Observable<EntregaModel[]> {
		return this.http.post<EntregaModel[]>(`${this.apiURL}entregas`,params);
	}
	getEntrega(id_empresa:number,id_evento:number,id_inscrito:number): Observable<EntregaModel> { 
 		return this.http.get<EntregaModel >(`${ this.apiURL}entrega/${id_empresa}/${id_evento}/${id_inscrito}`);
	}
	entregaInsert(entrega:EntregaModel):Observable<EntregaModel> { 
		return this.http.post<EntregaModel>(`${this.apiURL}entrega`, entrega);
	}
	entregaUpdate(entrega:EntregaModel):Observable<EntregaModel> { 
		return this.http.put<EntregaModel>(`${this.apiURL}entrega`,entrega);
	}
	entregaDelete(id_empresa:number,id_evento:number,id_inscrito:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}entrega/${id_empresa}/${id_evento}/${id_inscrito}`);
	}
}