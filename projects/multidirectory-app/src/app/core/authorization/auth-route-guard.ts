import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, EMPTY, iif, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '@services/app-settings.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthRouteGuard {
  constructor(
    private app: AppSettingsService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.app.userRx.pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status == 401) {
          if (route.url.join('/') !== 'login') {
            this.router.navigate(['login']);
            return EMPTY;
          }
        }
        return of(null);
      }),
      switchMap((user) => {
        if (route.url.join('/') == 'login') {
          if (!!user?.display_name) {
            this.router.navigate(['/']);
          } else {
            return of(true);
          }
        }

        return iif(() => !!user?.display_name, of(true), of(false));
      }),
    );
  }
}
