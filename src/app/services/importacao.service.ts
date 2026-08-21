import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ProcessaPlanilhaModel } from '../models/processa-planilha-model';
import { ParametroCheckFile01 } from '../parametros/parametro-check01';
import { CheckFileModel } from '../models/check_file-model';

@Injectable({
  providedIn: 'root',
})
export class ImportacaoService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}

  uploadPlanilha(id_evento: number, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('id_evento', id_evento.toString());

    const url = new URL('importacao/loadplanilha', this.apiURL).toString();
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  processaPlanilha(params: any): Observable<any> {
    const url = new URL('importacao/processamentoV2', this.apiURL).toString();
    return this.http.post<any>(url, params);
  }

  checkFile(params: ParametroCheckFile01): Observable<CheckFileModel> {
    const url = new URL('importacao/checkplanilha', this.apiURL).toString();
    return this.http.post<CheckFileModel>(url, params);
  }

}
