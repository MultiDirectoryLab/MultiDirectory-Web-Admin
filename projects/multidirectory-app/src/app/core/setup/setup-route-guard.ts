import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { EMPTY, Observable, catchError, map, of } from "rxjs";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class SetupRouteGuard  {
    constructor(private multidirectoryApi: MultidirectoryApiService, private router: Router, private toast: ToastrService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.multidirectoryApi.checkSetup().pipe(
            catchError((err, caughtRx) => {
                if(err.status == 0) {
                    this.toast.error('Backend does not response');
                    this.router.navigate([ '/enable-backend' ]);
                    return of(true);
                }
                return caughtRx;
            }),    
            map(x => {
                if(route.url.join('/') == 'setup') {
                    if(x) 
                        return this.router.createUrlTree(['/login']);
                    else 
                        return true;
                }

                if(!x) {
                    return this.router.createUrlTree(['/setup']);
                }
                return x;
            }));
    }
}