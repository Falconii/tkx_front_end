import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Usuario_EventoModel } from '../models/usuario_evento-model';
import { ParametroUsuario_Evento01 } from '../parametros/parametro-usuario_evento01';

@Injectable({
providedIn: 'root',
})
export class Usuario_EventoService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getUsuarios_Eventos(): Observable<Usuario_EventoModel[]> {
	const url = new URL('usuario_evento/usuarios_eventos', this.apiURL).toString();
		return this.http.get<Usuario_EventoModel[]>(`${url}`);
	}
	getUsuarios_EventosParametro_01(params: ParametroUsuario_Evento01): Observable<Usuario_EventoModel[]> {
	const url = new URL('usuario_evento/usuarios_eventos', this.apiURL).toString();
		return this.http.post<Usuario_EventoModel[]>(url,params);
	}
	getUsuario_Evento(id_empresa:number,id_evento:number,cnpj_cpf:string): Observable<Usuario_EventoModel> { 
 	const url = new URL('usuario_evento', this.apiURL).toString();
		return this.http.get<Usuario_EventoModel >(`${url}/${id_empresa}/${id_evento}/${cnpj_cpf}`);
	}
	usuario_eventoInsert(usuario_evento:Usuario_EventoModel):Observable<Usuario_EventoModel> { 
	const url = new URL('usuario_evento', this.apiURL).toString();
		return this.http.post<Usuario_EventoModel>(url, usuario_evento);
	}
	usuario_eventoUpdate(usuario_evento:Usuario_EventoModel):Observable<Usuario_EventoModel> { 
	const url = new URL('usuario_evento', this.apiURL).toString();
		return this.http.put<Usuario_EventoModel>(url,usuario_evento);
	}
	usuario_eventoDelete(id_empresa:number,id_evento:number,cnpj_cpf:string):Observable<any>  { 
 	const url = new URL('usuario_evento', this.apiURL).toString();
		return this.http.delete<any>(`${url}/${id_empresa}/${id_evento}/${cnpj_cpf}`);
	}
}