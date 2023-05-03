import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Constants } from "../constants";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthRouteGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const accessToken = localStorage.getItem(Constants.AccessToken);
        if(!accessToken) {
            this.router.navigate(['login']);
            return false;
        }
        return !!accessToken 
    }
}