import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { AppSettingsService } from '@services/app-settings.service';

@Injectable()
export class EnsureBearerInterceptor implements HttpInterceptor {
  constructor(
    private app: AppSettingsService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url);
    if (req.url.endsWith('auth/token/refresh')) {
      const user = !!this.app.user.display_name;
      if (!user) {
        this.router.navigateByUrl('/login');
        return EMPTY;
      }
    }
    return next.handle(req);
  }
}
