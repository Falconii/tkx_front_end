import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RelatorioDisponivel, TarefaModel } from '../models/tarefa-model';
import { ParametroTarefa01 } from '../parametros/parametro-tarefa01';

/** cabeçalho lido pelo LoadingInterceptor: a chamada não liga o spinner global */
export const SEM_SPINNER = 'X-Skip-Loading';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  /** cria a tarefa (relatório) pendente */
  incluir(sigla: string, parametros: object): Observable<TarefaModel> {
    return this.http
      .post<{ data: { tarefa: TarefaModel } }>(`${this.apiURL}tarefa`, {
        sigla,
        parametros,
      })
      .pipe(map((resp) => resp.data.tarefa));
  }

  /** status de uma tarefa. semSpinner = true no polling, para não piscar o spinner global */
  getTarefa(id: number, semSpinner: boolean = false): Observable<TarefaModel> {
    const headers = semSpinner
      ? new HttpHeaders({ [SEM_SPINNER]: '1' })
      : undefined;
    return this.http.get<TarefaModel>(`${this.apiURL}tarefa/${id}`, {
      headers,
    });
  }

  /** tarefas do usuário logado, mais recentes primeiro */
  listar(limite: number = 100): Observable<TarefaModel[]> {
    return this.http.get<TarefaModel[]>(`${this.apiURL}tarefa`, {
      params: { limite },
    });
  }

  /**
   * Pesquisa paginada das tarefas do usuário logado (tela de acompanhamento).
   * Com contador 'S' o backend devolve { total }. semSpinner = true nas atualizações automáticas.
   */
  pesquisar(
    params: ParametroTarefa01,
    semSpinner: boolean = false,
  ): Observable<any> {
    const headers = semSpinner
      ? new HttpHeaders({ [SEM_SPINNER]: '1' })
      : undefined;
    return this.http.post<any>(`${this.apiURL}tarefa/pesquisa`, params, {
      headers,
    });
  }

  /** relatórios disponíveis (sigla + título), para o filtro */
  getRelatorios(): Observable<RelatorioDisponivel[]> {
    return this.http.get<RelatorioDisponivel[]>(
      `${this.apiURL}tarefa/relatorios`,
    );
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.apiURL}tarefa/${id}/download`, {
      responseType: 'blob',
    });
  }

  enviarEmail(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiURL}tarefa/${id}/email`,
      {},
    );
  }
}
