import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private globalService: GlobalService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.globalService.setSpin(true); // liga o spinner

    return next.handle(req).pipe(
      finalize(() => this.globalService.setSpin(false)) // desliga o spinner
    );
  }
}
