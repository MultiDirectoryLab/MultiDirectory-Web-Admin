import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { translate } from '@jsverse/transloco';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, delay, map, Observable, of, switchMap } from 'rxjs';

export const setupRouteGuardCanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean | UrlTree> => {
  const multidirectoryApi = inject(MultidirectoryApiService);
  const router = inject(Router);
  const toast = inject(ToastrService);

  let calls = 0;
  return multidirectoryApi.checkSetup().pipe(
    catchError((err, caughtRx) => {
      if (err.status == 0 || calls > 5) {
        toast.error(translate('backend-status.backend-is-not-responding'));
        router.navigate(['/enable-backend']);
        return of(true);
      }
      calls++;
      return of(true).pipe(
        delay(200 * calls),
        switchMap(() => caughtRx),
      );
    }),
    map((x) => {
      calls = 0;
      if (route.url.join('/') == 'setup') {
        if (x) return router.createUrlTree(['/login']);
        else return true;
      }

      if (!x) {
        return router.createUrlTree(['/setup']);
      }
      return x;
    }),
  );
};
