import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { catchError, Observable, of } from "rxjs";
import { EventoModel } from "../models/evento-model";
import { ParametroEvento01 } from "../parametros/parametro-evento01";
import { EventoService } from "../services/evento.service";
import { GlobalService } from "../services/global.service";
import { messageError } from "../shared/classes/util";
import { LocalStorageService } from "../services/localStorage.service";
import { AppSnackbar } from "../shared/classes/app-snackbar";

@Injectable({ providedIn: 'root' })
export class EventoResolver implements Resolve<EventoModel[]> {
  constructor(private eventoSrv: EventoService,
              private appSnackBar: AppSnackbar,
              private globalService:GlobalService,
              private localStorageSrv: LocalStorageService,
  ) { }

  resolve(): Observable<EventoModel[]> {
    const par = new ParametroEvento01();
    par.id_empresa = this.globalService.getEmpresa().id;
    par.status = '3';
    par.orderby = '000001';

    return this.eventoSrv.getEventosParametro_01(par).pipe(
      catchError(error =>
        {
          if (error.status && error.status == 401) {
                    this.localStorageSrv.clear();
                    this.appSnackBar.openFailureSnackBar('Ação Não Autorizada', 'OK');
          }
          if (error.status && error.status == 409) {
            this.appSnackBar.openFailureSnackBar(
              `Nenhum Evento Encontrado!`,
              'OK',
            );
          } else {
            this.appSnackBar.openFailureSnackBar(
              `Erro Na Pesquisa Dos Eventos ${messageError(error)}`,
              'OK',
            );
          }
          return of([]); // evita quebrar a rota
        })
    );
  }
}
