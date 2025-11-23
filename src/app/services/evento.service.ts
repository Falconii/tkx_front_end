import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventoModel } from '../models/evento-model';
import { ParametroEvento01 } from '../parametros/parametro-evento01';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}
  getEventos(): Observable<EventoModel[]> {
    const url = new URL('evento/eventos', this.apiURL).toString();
    return this.http.get<EventoModel[]>(url);
  }
  getEventosParametro_01(params: ParametroEvento01): Observable<EventoModel[]> {
    const url = new URL('evento/eventos', this.apiURL).toString();
    return this.http.post<EventoModel[]>(url, params);
  }
  getEvento(id_empresa: number, id: number): Observable<EventoModel> {
    const url = new URL('evento', this.apiURL).toString();
    return this.http.get<EventoModel>(`${url}/${id_empresa}/${id}`);
  }
  eventoInsert(evento: EventoModel): Observable<EventoModel> {
    const url = new URL('evento', this.apiURL).toString();
    return this.http.post<EventoModel>(url, evento);
  }
  eventoUpdate(evento: EventoModel): Observable<EventoModel> {
    const url = new URL('evento', this.apiURL).toString();
    return this.http.put<EventoModel>(url, evento);
  }
  eventoDelete(id_empresa: number, id: number): Observable<any> {
    const url = new URL('evento', this.apiURL).toString();
    return this.http.delete<any>(`${url}/${id_empresa}/${id}`);
  }
}
