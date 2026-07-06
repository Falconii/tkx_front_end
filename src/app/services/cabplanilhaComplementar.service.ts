import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  interval,
  map,
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
  ): Observable<{ tentativa: number; lista: any[] }> {

    const intervalo = 3000;
    const tentativas = 40;

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
      switchMap((i) =>
        this.cabPlanilhaSrv.getCabplanilhasParametro_01(par).pipe(
          map(lista => ({ tentativa: i + 1, lista })),
          catchError(err => {
            if (err.status === 409) {
              return of({ tentativa: i + 1, lista: [] });
            }
            return throwError(() => err);
          })
        )
      )
    );
  }
}
