import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LdapEntity } from "../core/ldap/ldap-entity";

@Injectable({
    providedIn: 'root'
})
export class AppWindowsService {
    private _openEntityPropertiesModalRx = new Subject<LdapEntity>();
    get openEntityPropertiesModalRx(): Observable<LdapEntity> {
        return this._openEntityPropertiesModalRx.asObservable();
    }
    openEntityProperiesModal(entity: LdapEntity) {
        this._openEntityPropertiesModalRx.next(entity);
    }

    private _openChangePasswordModalRx = new Subject<LdapEntity>();
    get openChangePasswordModalRx(): Observable<LdapEntity> {
        return this._openChangePasswordModalRx.asObservable();
    }
    openChangePasswordModal(entity: LdapEntity) {
        this._openChangePasswordModalRx.next(entity);
    }

    private _toggleGlobalSpinnerRx = new Subject<boolean>();
    get globalSpinnerRx(): Observable<boolean> {
        return this._toggleGlobalSpinnerRx.asObservable();
    }
    hideSpinner() {
        this._toggleGlobalSpinnerRx.next(false);
    }
    showSpinner() {
        this._toggleGlobalSpinnerRx.next(true);
    }
}