import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

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
}
