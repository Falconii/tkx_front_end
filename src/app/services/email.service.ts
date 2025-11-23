import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametroSendemailv2 } from '../parametros/parametro-sendemailv2';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  apiURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  sendEmailV2(
    params: ParametroSendemailv2
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiURL}enviaremailarquivo`,
      params
    );
  }
}
