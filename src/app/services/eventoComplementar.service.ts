import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  interval,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CabplanilhaModel } from '../models/cabplanilha-model';
import { ParametroCabplanilha01 } from '../parametros/parametro-cabplanilha01';
import { ParametroDeletaplanilha } from '../parametros/parametro-deletaplanilha';
import { CabplanilhaService } from './cabplanilha.service';
import { ParametroEvento01 } from '../parametros/parametro-evento01';
import { ResumoCategoriaModel } from '../models/resumo-categoria-model';

@Injectable({
  providedIn: 'root',
})
export class EventoComplementarService {
  apiURL: string = environment.apiURL;
  constructor(
    private http: HttpClient,
    private cabPlanilhaSrv: CabplanilhaService,
  ) {}

  updateStatusEvento(params: ParametroEvento01): Observable<any> {
    const url = new URL(
      'evento_complementar/updateStatusEvento',
      this.apiURL,
    ).toString();
    return this.http.put<any>(url, params);
  }

  resumoCategoria(id_evento: number): Observable<ResumoCategoriaModel[]> {
    const url = new URL(
      'evento_complementar/resumocategoria',
      this.apiURL,
    ).toString();
    return this.http.put<ResumoCategoriaModel[]>(url, { id_evento });
  }
}
