import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Constants } from "../constants";
import { Injectable } from "@angular/core";
import { TokenStorageHelper } from "./token-storage-helper";

@Injectable()
export class AuthRouteGuard  {
    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const accessToken = TokenStorageHelper.getAccessToken();
        if(route.url.join('/') == 'login') {
            if(!!accessToken) {
                this.router.navigate(['/']);
            } else {
                return true;
            }
        }
        if(!accessToken) {
            this.router.navigate(['login']);
            return false;
        }
        return !!accessToken 
    }
}