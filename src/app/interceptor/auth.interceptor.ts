import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from '../services/localStorage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // 🔓 Rotas que NÃO exigem token e NÃO devem redirecionar em 401
  private rotasPublicas = [
    '/api/login',
    '/api/login/redefinepassword',
    '/api/public/liberaevento'
  ];

  constructor(
    private localStorageSrv: LocalStorageService,
    private router: Router,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {

    const url = request.url;

    const isPublic = this.rotasPublicas.some(r => url.includes(r));

    // 🔓 Se a rota é pública → não adiciona token
    if (isPublic) {
      return next.handle(request);
    }

    // 🔐 Rotas privadas → adiciona token se existir
    const token = this.localStorageSrv.getString('Token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        // ❗ Se a rota é pública → não redireciona nunca
        if (isPublic) {
          return throwError(() => error);
        }

        // ❗ Se deu 401 e NÃO é rota pública → redireciona
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      }),
    );
  }
}
