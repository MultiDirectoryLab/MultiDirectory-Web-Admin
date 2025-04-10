import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { AppSettingsService } from '@services/app-settings.service';

@Injectable()
export class EnsureBearerInterceptor implements HttpInterceptor {
  private app = inject(AppSettingsService);
  private router = inject(Router);

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
