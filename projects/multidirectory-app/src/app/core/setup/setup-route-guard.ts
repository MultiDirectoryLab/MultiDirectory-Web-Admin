import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EMPTY, Observable, catchError, delay, map, of, switchMap } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { translate } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class SetupRouteGuard {
  constructor(
    private multidirectoryApi: MultidirectoryApiService,
    private router: Router,
    private toast: ToastrService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    let calls = 0;
    return this.multidirectoryApi.checkSetup().pipe(
      catchError((err, caughtRx) => {
        if (err.status == 0 || calls > 5) {
          this.toast.error(translate('backend-status.backend-is-not-responding'));
          this.router.navigate(['/enable-backend']);
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
          if (x) return this.router.createUrlTree(['/login']);
          else return true;
        }

        if (!x) {
          return this.router.createUrlTree(['/setup']);
        }
        return x;
      }),
    );
  }
}
