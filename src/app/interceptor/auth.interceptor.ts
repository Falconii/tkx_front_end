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
import { GlobalService } from '../services/global.service';
import { LocalStorageService } from '../services/localStorage.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorageSrv: LocalStorageService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/api/login')) {
      return next.handle(request); // não modifica
    }
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
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true;
    }
  }
}
