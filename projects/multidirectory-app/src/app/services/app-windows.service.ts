import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LdapEntryNode } from "../core/ldap/ldap-entity";
import { TreeItemComponent } from "dist/multidirectory-ui-kit/lib/components/treeview/tree-item.component";
import { NavigationNode } from "../core/navigation/navigation-node";

@Injectable({
    providedIn: 'root'
})
export class AppWindowsService {
    private _openEntityPropertiesModalRx = new Subject<LdapEntryNode>();
    get openEntityPropertiesModalRx(): Observable<LdapEntryNode> {
        return this._openEntityPropertiesModalRx.asObservable();
    }
    openEntityProperiesModal(entity: LdapEntryNode) {
        this._openEntityPropertiesModalRx.next(entity);
    }

    private _openChangePasswordModalRx = new Subject<LdapEntryNode>();
    get openChangePasswordModalRx(): Observable<LdapEntryNode> {
        return this._openChangePasswordModalRx.asObservable();
    }
    openChangePasswordModal(entity: LdapEntryNode) {
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


    private _showContextMenuRx = new Subject<void>();
    get showContextMenuRx() {
        return this._showContextMenuRx.asObservable();
    }
    showContextMenu(node: NavigationNode) {
        this._showContextMenuRx.next();
    }
}