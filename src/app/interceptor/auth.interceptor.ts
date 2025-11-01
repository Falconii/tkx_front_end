import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private globalService: GlobalService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptando requisição para adicionar token de autenticação.');
    //const token = localStorage.getItem('jwtToken'); // ou de um serviço de autenticação
    const token = this.globalService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
console.log('Requisição interceptada:', request);
    return next.handle(request);
  }
}
