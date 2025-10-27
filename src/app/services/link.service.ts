import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LinkModel } from '../models/link-model';
import { ParametroLink01 } from '../parametros/parametro-link01';

@Injectable({
providedIn: 'root',
})
export class LinkService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getLnks(): Observable<LinkModel[]> {
		return this.http.get<LinkModel[]>(`${this.apiURL}Lnks`);
	}
	getLnksParametro_01(params: ParametroLink01): Observable<LinkModel[]> {
		return this.http.post<LinkModel[]>(`${this.apiURL}lnks`,params);
	}
	getLink(id_empresa:number,id_evento:number,id_inscrito:number): Observable<LinkModel> { 
 		return this.http.get<LinkModel >(`${ this.apiURL}link/${id_empresa}/${id_evento}/${id_inscrito}`);
	}
	linkInsert(link:LinkModel):Observable<LinkModel> { 
		return this.http.post<LinkModel>(`${this.apiURL}link`, link);
	}
	linkUpdate(link:LinkModel):Observable<LinkModel> { 
		return this.http.put<LinkModel>(`${this.apiURL}link`,link);
	}
	linkDelete(id_empresa:number,id_evento:number,id_inscrito:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}link/${id_empresa}/${id_evento}/${id_inscrito}`);
	}
}