import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

@Injectable()
export class StaleTokenInterceptor implements HttpInterceptor {
  constructor(private api: MultidirectoryApiService) {}

  exceptUrl = ['auth/token/get', 'auth/token/refresh'];
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 401 || this.exceptUrl.some((url) => err.url?.includes(url))) {
          throw err;
        }
        return this.api.refresh().pipe(
          switchMap(() => {
            return next.handle(req);
          }),
        );
      }),
    );
  }
}
