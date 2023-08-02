import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class SetupRouteGuard  {
    constructor(private multidirectoryApi: MultidirectoryApiService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.multidirectoryApi.checkSetup().pipe(map(x => {
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