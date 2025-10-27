import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventoModel } from '../models/evento-model';
import { ParametroEvento01 } from '../parametros/parametro-evento01';

@Injectable({
providedIn: 'root',
})
export class EventoService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getEventos(): Observable<EventoModel[]> {
		return this.http.get<EventoModel[]>(`${this.apiURL}Eventos`);
	}
	getEventosParametro_01(params: ParametroEvento01): Observable<EventoModel[]> {
		return this.http.post<EventoModel[]>(`${this.apiURL}eventos`,params);
	}
	getEvento(id_empresa:number,id:number): Observable<EventoModel> { 
 		return this.http.get<EventoModel >(`${ this.apiURL}evento/${id_empresa}/${id}`);
	}
	eventoInsert(evento:EventoModel):Observable<EventoModel> { 
		return this.http.post<EventoModel>(`${this.apiURL}evento`, evento);
	}
	eventoUpdate(evento:EventoModel):Observable<EventoModel> { 
		return this.http.put<EventoModel>(`${this.apiURL}evento`,evento);
	}
	eventoDelete(id_empresa:number,id:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}evento/${id_empresa}/${id}`);
	}
}