import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, catchError, tap } from 'rxjs';
import { TokenStorageHelper } from './token-storage-helper';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.endsWith('auth/token/refresh')) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status == 401) {
          TokenStorageHelper.clear();
          this.router.navigateByUrl('/login');
          return EMPTY;
        }
        throw err;
      }),
      tap((event) => {
        if (event.type == HttpEventType.Response) {
          TokenStorageHelper.setAccessToken(event.body['access_token']);
          TokenStorageHelper.setRefreshToken(event.body['refresh_token']);
        }
      }),
    );
  }
}
