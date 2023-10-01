import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LdapEntity } from "../core/ldap/ldap-entity";

@Injectable({
    providedIn: 'root'
})
export class LdapWindowsService {
    private _openEntityPropertiesModalRx = new Subject<LdapEntity>();
    get openEntityPropertiesModalRx(): Observable<LdapEntity> {
        return this._openEntityPropertiesModalRx.asObservable();
    }
    openEntityProperiesModal(entity: LdapEntity) {
        this._openEntityPropertiesModalRx.next(entity);
    }
}