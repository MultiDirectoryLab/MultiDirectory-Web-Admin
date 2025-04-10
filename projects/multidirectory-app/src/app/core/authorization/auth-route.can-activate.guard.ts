import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AppSettingsService } from '@services/app-settings.service';
import { catchError, EMPTY, iif, Observable, of, switchMap } from 'rxjs';

export const authRouteGuardCanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  const app = inject(AppSettingsService);
  const router = inject(Router);

  return app.userRx.pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status == 401) {
        if (route.url.join('/') !== 'login') {
          router.navigate(['login']);
          return EMPTY;
        }
      }
      return of(null);
    }),
    switchMap((user) => {
      if (route.url.join('/') == 'login') {
        if (!!user?.display_name) {
          router.navigate(['/']);
        } else {
          return of(true);
        }
      }

      return iif(() => !!user?.display_name, of(true), of(false));
    }),
  );
};
