import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UsuarioModel } from '../models/usuario-model';
import { ParametroUsuario01 } from '../parametros/parametro-usuario01';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}
  getUsuarios(): Observable<UsuarioModel[]> {
    const url = new URL('usuario/usuarios', this.apiURL).toString();
    return this.http.get<UsuarioModel[]>(`${url}`);
  }
  getUsuariosParametro_01(
    params: ParametroUsuario01,
  ): Observable<UsuarioModel[]> {
    const url = new URL('usuario/usuarios', this.apiURL).toString();
    return this.http.post<UsuarioModel[]>(url, params);
  }
  getUsuario(id_empresa: number, id: number): Observable<UsuarioModel> {
    const url = new URL('usuario', this.apiURL).toString();
    return this.http.get<UsuarioModel>(`${url}/${id_empresa}/${id}`);
  }
  usuarioInsert(usuario: UsuarioModel): Observable<UsuarioModel> {
    const url = new URL('usuario', this.apiURL).toString();
    return this.http.post<UsuarioModel>(url, usuario);
  }
  usuarioUpdate(usuario: UsuarioModel): Observable<UsuarioModel> {
    const url = new URL('usuario', this.apiURL).toString();
    return this.http.put<UsuarioModel>(url, usuario);
  }
  usuarioDelete(id_empresa: number, id: number): Observable<any> {
    const url = new URL('usuario', this.apiURL).toString();
    return this.http.delete<any>(`${url}/${id_empresa}/${id}`);
  }

  updatesenha(params: any): Observable<UsuarioModel[]> {
    const url = new URL('usuario/updatesenha', this.apiURL).toString();
    return this.http.post<UsuarioModel[]>(url, params);
  }
}
