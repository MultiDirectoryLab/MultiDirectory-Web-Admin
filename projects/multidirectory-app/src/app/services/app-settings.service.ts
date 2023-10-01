import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, Subject, defaultIfEmpty, iif, of, tap } from "rxjs";
import { WhoamiResponse } from "../models/whoami/whoami-response";
import { MultidirectoryApiService } from "./multidirectory-api.service";
import { LdapEntity } from "../core/ldap/ldap-entity";

@Injectable({
    providedIn: "root"
})
export class AppSettingsService {
    constructor(private api: MultidirectoryApiService) {}
    navigationalPanelVisibleRx = new BehaviorSubject<boolean>(true)
    setNavigationalPanelVisiblity(state: boolean) {
        this.navigationalPanelVisibleRx.next(state);
    }
    userEntry?: LdapEntity;
    private _user: WhoamiResponse = new WhoamiResponse({});
    get user(): WhoamiResponse {
        return this._user;
    }
    set user(user: WhoamiResponse) {
        this._user = user;
    } 
    get userRx(): Observable<WhoamiResponse> {
        console.log(this._user)
        return iif(
            () => this._user.id == 0, 
            this.api.whoami().pipe(tap(x => { this.user = x })),
            of(this._user));
    }
}