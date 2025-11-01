import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParticipanteModel } from '../models/participante-model';
import { ParametroParticipante01 } from '../parametros/parametro-participante01';
import { environment } from '../../environments/environment.development';

@Injectable({
providedIn: 'root',
})
export class ParticipanteService
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getParticipantes(): Observable<ParticipanteModel[]> {
		return this.http.get<ParticipanteModel[]>(`${this.apiURL}Participantes`);
	}
	getParticipantesParametro_01(params: ParametroParticipante01): Observable<ParticipanteModel[]> {
    console.log('ParametroParticipante01',params);
    console.log('API URL',`${this.apiURL}participante/participantesparticipantes`);
		return this.http.post<ParticipanteModel[]>(`${this.apiURL}participante/participantes`,params);
	}
	getParticipante(id_empresa:number,id_evento:number,id_inscrito:number,inscricao:number): Observable<ParticipanteModel> {
 		return this.http.get<ParticipanteModel >(`${ this.apiURL}participante/${id_empresa}/${id_evento}/${id_inscrito}/${inscricao}`);
	}
	participanteInsert(participante:ParticipanteModel):Observable<ParticipanteModel> {
		return this.http.post<ParticipanteModel>(`${this.apiURL}participante`, participante);
	}
	participanteUpdate(participante:ParticipanteModel):Observable<ParticipanteModel> {
		return this.http.put<ParticipanteModel>(`${this.apiURL}participante`,participante);
	}
	participanteDelete(id_empresa:number,id_evento:number,id_inscrito:number,inscricao:number):Observable<any>  {
 		return this.http.delete<any>(`${this.apiURL}participante/${id_empresa}/${id_evento}/${id_inscrito}/${inscricao}`);
	}
}
