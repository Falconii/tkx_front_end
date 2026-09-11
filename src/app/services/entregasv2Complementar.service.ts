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
import { ResumoOperadorModel } from '../models/resumo-operador-model';
import { Entregav2Model } from '../models/entregav2-model';
import { EntregaparticipanteModel } from '../models/entregaparticipante-model';

@Injectable({
  providedIn: 'root',
})
export class Entregasv2ComplementarService {
  apiURL: string = environment.apiURL;
  constructor(
    private http: HttpClient,
  ) {}


  insertentregaparticipante(id_participante:number, entregav2:Entregav2Model):Observable<EntregaparticipanteModel> {
    const url = new URL('entregav2complementar/insertentregaparticipante', this.apiURL).toString();
      return this.http.post<EntregaparticipanteModel>(url, { id_participante, entregav2 });
    }

deleteentregaparticipante(
  id_participante: number,
  entregav2: Entregav2Model
): Observable<EntregaparticipanteModel> {

  const url = new URL(
    'entregav2complementar/deleteentregaparticipante',
    this.apiURL
  ).toString();

  return this.http.delete<EntregaparticipanteModel>(url, {
    body: { id_participante, entregav2 }
  });
}


}
