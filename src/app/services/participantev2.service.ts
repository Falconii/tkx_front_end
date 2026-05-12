import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Participantev2Model } from '../models/participantev2-model';
import { ParametroParticipantev201 } from '../parametros/parametro-participantev201';

@Injectable({
providedIn: 'root',
})
export class Participantev2Service 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getParticipantesv2(): Observable<Participantev2Model[]> {
	const url = new URL('participantev2/participantesv2', this.apiURL).toString();
		return this.http.get<Participantev2Model[]>(`${url}`);
	}
	getParticipantesv2Parametro_01(params: ParametroParticipantev201): Observable<Participantev2Model[]> {
	const url = new URL('participantev2/participantesv2', this.apiURL).toString();
		return this.http.post<Participantev2Model[]>(url,params);
	}
	getParticipantev2(id_empresa:number,id_evento:number,id:number): Observable<Participantev2Model> { 
 	const url = new URL('participantev2', this.apiURL).toString();
		return this.http.get<Participantev2Model >(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
	participantev2Insert(participantev2:Participantev2Model):Observable<Participantev2Model> { 
	const url = new URL('participantev2', this.apiURL).toString();
		return this.http.post<Participantev2Model>(url, participantev2);
	}
	participantev2Update(participantev2:Participantev2Model):Observable<Participantev2Model> { 
	const url = new URL('participantev2', this.apiURL).toString();
		return this.http.put<Participantev2Model>(url,participantev2);
	}
	participantev2Delete(id_empresa:number,id_evento:number,id:number):Observable<any>  { 
 	const url = new URL('participantev2', this.apiURL).toString();
		return this.http.delete<any>(`${url}/${id_empresa}/${id_evento}/${id}`);
	}
}