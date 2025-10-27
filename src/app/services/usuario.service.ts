import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from '../models/usuario-model';
import { ParametroUsuario01 } from '../parametros/parametro-usuario01';

@Injectable({
providedIn: 'root',
})
export class UsuarioService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getUsuarios(): Observable<UsuarioModel[]> {
		return this.http.get<UsuarioModel[]>(`${this.apiURL}Usuarios`);
	}
	getUsuariosParametro_01(params: ParametroUsuario01): Observable<UsuarioModel[]> {
		return this.http.post<UsuarioModel[]>(`${this.apiURL}usuarios`,params);
	}
	getUsuario(id_empresa:number,id:number): Observable<UsuarioModel> { 
 		return this.http.get<UsuarioModel >(`${ this.apiURL}usuario/${id_empresa}/${id}`);
	}
	usuarioInsert(usuario:UsuarioModel):Observable<UsuarioModel> { 
		return this.http.post<UsuarioModel>(`${this.apiURL}usuario`, usuario);
	}
	usuarioUpdate(usuario:UsuarioModel):Observable<UsuarioModel> { 
		return this.http.put<UsuarioModel>(`${this.apiURL}usuario`,usuario);
	}
	usuarioDelete(id_empresa:number,id:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}usuario/${id_empresa}/${id}`);
	}
}