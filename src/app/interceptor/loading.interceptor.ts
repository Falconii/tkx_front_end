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
    // chamadas repetidas (ex.: polling de tarefas) não devem piscar o spinner global
    if (req.headers.has('X-Skip-Loading')) {
      return next.handle(req.clone({ headers: req.headers.delete('X-Skip-Loading') }));
    }

    this.globalService.setSpin(true); // liga o spinner

    return next.handle(req).pipe(
      finalize(() => this.globalService.setSpin(false)) // desliga o spinner
    );
  }
}
