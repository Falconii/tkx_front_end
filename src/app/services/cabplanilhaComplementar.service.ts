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

@Injectable({
  providedIn: 'root',
})
export class CabplanilhaComplementarService {
  apiURL: string = environment.apiURL;
  constructor(
    private http: HttpClient,
    private cabPlanilhaSrv: CabplanilhaService,
  ) {}
  deletePlanilha(params: ParametroDeletaplanilha): Observable<any> {
    const url = new URL(
      'cabplanilha_complementar/deletaPlanilha',
      this.apiURL,
    ).toString();
    return this.http.post<any>(url, params);
  }

  verificarStatus(
    idEmpresa: number,
    idEvento: number,
    fileName: string,
  ): Observable<any[]> {
    const intervalo = 3000; // 3 segundos
    const tentativas = 40; // 2 minutos

    const par: ParametroCabplanilha01 = {
      id_empresa: idEmpresa,
      id_evento: idEvento,
      id: 0,
      arquivo: fileName,
      status: '',
      pagina: 0,
      tamPagina: 50,
      contador: 'N',
      orderby: '',
      sharp: false,
    };

    return interval(intervalo).pipe(
      take(tentativas),
      switchMap(() =>
        this.cabPlanilhaSrv.getCabplanilhasParametro_01(par).pipe(
          catchError((err) => {
            if (err.status === 409) {
              // 409 = planilha ainda não encontrada → continuar polling
              return of([]); // devolve array vazio
            }
            // Erros reais → interrompe o polling
            return throwError(() => err);
          }),
        ),
      ),
    );
  }
}
