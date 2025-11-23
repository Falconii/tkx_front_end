import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginModel } from '../models/login-model';
import { ParametroLogin01 } from '../parametros/parametro-login01';

@Injectable({
  providedIn: 'root',
})
export class loginService {
  apiURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}

  login(params: ParametroLogin01): Observable<LoginModel> {
    return this.http.post<LoginModel>(`${this.apiURL}login`, params);
  }
}
