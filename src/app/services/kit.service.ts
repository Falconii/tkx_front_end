import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KitModel } from '../models/kit-model';
import { ParametroKit01 } from '../parametros/parametro-kit01';

@Injectable({
providedIn: 'root',
})
export class KitService 
{
apiURL: string = environment.apiURL;
constructor(private http: HttpClient) {}
	getKits(): Observable<KitModel[]> {
		return this.http.get<KitModel[]>(`${this.apiURL}Kits`);
	}
	getKitsParametro_01(params: ParametroKit01): Observable<KitModel[]> {
		return this.http.post<KitModel[]>(`${this.apiURL}kits`,params);
	}
	getKit(id_empresa:number,id_evento:number,id_inscrito:number): Observable<KitModel> { 
 		return this.http.get<KitModel >(`${ this.apiURL}kit/${id_empresa}/${id_evento}/${id_inscrito}`);
	}
	kitInsert(kit:KitModel):Observable<KitModel> { 
		return this.http.post<KitModel>(`${this.apiURL}kit`, kit);
	}
	kitUpdate(kit:KitModel):Observable<KitModel> { 
		return this.http.put<KitModel>(`${this.apiURL}kit`,kit);
	}
	kitDelete(id_empresa:number,id_evento:number,id_inscrito:number):Observable<any>  { 
 		return this.http.delete<any>(`${this.apiURL}kit/${id_empresa}/${id_evento}/${id_inscrito}`);
	}
}