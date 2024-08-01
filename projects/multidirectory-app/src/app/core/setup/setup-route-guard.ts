import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { translate } from '@ngneat/transloco';

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
    return this.multidirectoryApi.checkSetup().pipe(
      catchError((err, caughtRx) => {
        if (err.status == 0) {
          this.toast.error(translate('backend-status.backend-is-not-responding'));
          console.log('goes to enable backend');
          this.router.navigate(['/enable-backend']);
          return of(true);
        }
        return caughtRx;
      }),
      map((x) => {
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
