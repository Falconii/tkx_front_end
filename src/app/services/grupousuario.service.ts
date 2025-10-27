import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GrupousuarioModel } from '../models/grupousuario-model';
import { ParametroGrupousuario01 } from '../parametros/parametro-grupousuario01';

@Injectable({
providedIn: 'root',
})
export class GrupousuarioService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getGruposusuarios(): Observable<GrupousuarioModel[]> {
		return this.http.get<GrupousuarioModel[]>(`${this.apiURL}Gruposusuarios`);
	}
	getGruposusuariosParametro_01(params: ParametroGrupousuario01): Observable<GrupousuarioModel[]> {
		return this.http.post<GrupousuarioModel[]>(`${this.apiURL}gruposusuarios`,params);
	}
	getGrupousuario(id_empresa:number,codigo:number): Observable<GrupousuarioModel> { 
 		return this.http.get<GrupousuarioModel >(`${ this.apiURL}grupousuario/${id_empresa}/${codigo}`);
	}
	grupousuarioInsert(grupousuario:GrupousuarioModel):Observable<GrupousuarioModel> { 
		return this.http.post<GrupousuarioModel>(`${this.apiURL}grupousuario`, grupousuario);
	}
	grupousuarioUpdate(grupousuario:GrupousuarioModel):Observable<GrupousuarioModel> { 
		return this.http.put<GrupousuarioModel>(`${this.apiURL}grupousuario`,grupousuario);
	}
	grupousuarioDelete(id_empresa:number,codigo:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}grupousuario/${id_empresa}/${codigo}`);
	}
}