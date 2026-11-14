import { ResumoKitModel } from './../models/resumo-kit-model';
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
import { EventoModel } from '../models/evento-model';
import { ResumoCategoriaModel } from '../models/resumo-categoria-model';
import { ResumoOperadorModel } from '../models/resumo-operador-model';

@Injectable({
  providedIn: 'root',
})
export class EventoComplementarService {
  apiURL: string = environment.apiURL;
  constructor(
    private http: HttpClient,
    private cabPlanilhaSrv: CabplanilhaService,
  ) {}

  /** Trocar Situação Evento (só MASTER/TI): status '2' StandBy, '3' Ativo ou '4' Encerrado */
  updateStatusEvento(id_evento: number, status: string): Observable<EventoModel> {
    const url = new URL(
      'evento_complementar/updateStatusEvento',
      this.apiURL,
    ).toString();
    return this.http.put<EventoModel>(url, { id_evento, status });
  }

  resumoCategoria(id_evento: number): Observable<ResumoCategoriaModel[]> {
    const url = new URL(
      'evento_complementar/resumocategoria',
      this.apiURL,
    ).toString();
    return this.http.post<ResumoCategoriaModel[]>(url, { id_evento });
  }

  resumoOPerador(id_evento: number): Observable<ResumoOperadorModel[]> {
    const url = new URL(
      'evento_complementar/resumooperador',
      this.apiURL,
    ).toString();
    return this.http.post<ResumoOperadorModel[]>(url, { id_evento });
  }

  /**
   * Eventos do DASHBOARD do usuário logado (só eventos ativos): operador vê apenas os eventos
   * em que está vinculado (usuarios_eventos); os demais usuários veem todos os ativos.
   */
  eventosDashboard(): Observable<EventoModel[]> {
    const url = new URL(
      'evento_complementar/dashboard',
      this.apiURL,
    ).toString();
    return this.http.get<EventoModel[]>(url);
  }

    resumoKit(id_evento: number): Observable<ResumoKitModel[]> {
    const url = new URL(
      'evento_complementar/resumokit',
      this.apiURL,
    ).toString();
    return this.http.post<ResumoKitModel[]>(url, { id_evento });
  }

}
