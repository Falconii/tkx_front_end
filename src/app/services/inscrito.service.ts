import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InscritoModel } from '../models/inscrito-model';
import { ParametroInscrito01 } from '../parametros/parametro-inscrito01';

@Injectable({
providedIn: 'root',
})
export class InscritoService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getInscritos(): Observable<InscritoModel[]> {
		return this.http.get<InscritoModel[]>(`${this.apiURL}Inscritos`);
	}
	getInscritosParametro_01(params: ParametroInscrito01): Observable<InscritoModel[]> {
		return this.http.post<InscritoModel[]>(`${this.apiURL}inscritos`,params);
	}
	getInscrito(id_empresa:number,id:number): Observable<InscritoModel> { 
 		return this.http.get<InscritoModel >(`${ this.apiURL}inscrito/${id_empresa}/${id}`);
	}
	inscritoInsert(inscrito:InscritoModel):Observable<InscritoModel> { 
		return this.http.post<InscritoModel>(`${this.apiURL}inscrito`, inscrito);
	}
	inscritoUpdate(inscrito:InscritoModel):Observable<InscritoModel> { 
		return this.http.put<InscritoModel>(`${this.apiURL}inscrito`,inscrito);
	}
	inscritoDelete(id_empresa:number,id:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}inscrito/${id_empresa}/${id}`);
	}
}