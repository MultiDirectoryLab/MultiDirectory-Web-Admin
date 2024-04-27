import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { TokenStorageHelper } from './token-storage-helper';

@Injectable()
export class EnsureBearerInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token;
    if (req.url.endsWith('auth/token/refresh')) {
      token = TokenStorageHelper.getRefreshToken();
      if (!token) {
        TokenStorageHelper.clear();
        this.router.navigateByUrl('/login');
        return EMPTY;
      }
    } else {
      token = TokenStorageHelper.getAccessToken();
    }
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next.handle(modifiedReq);
  }
}
