import { Injectable } from "@angular/core";
import { Observable, Subject, of, pipe, switchMap, take } from "rxjs";
import { LdapEntryNode } from "../core/ldap/ldap-entity";
import { TreeItemComponent } from "dist/multidirectory-ui-kit/lib/components/treeview/tree-item.component";
import { NavigationNode } from "../core/navigation/navigation-node";

@Injectable({
    providedIn: 'root'
})
export class AppWindowsService {
    private _openEntityPropertiesModalRx = new Subject<LdapEntryNode>();
    private _closeEntityPropertiesModalRx = new Subject<LdapEntryNode>();
    get openEntityPropertiesModalRx(): Observable<LdapEntryNode> {
        return this._openEntityPropertiesModalRx.asObservable();
    }
    get closeEntityPropertiesModalRx(): Observable<LdapEntryNode> {
        return this._closeEntityPropertiesModalRx.pipe(take(1));
    }
    openEntityProperiesModal(entity: LdapEntryNode): Observable<LdapEntryNode> {
        this._openEntityPropertiesModalRx.next(entity);
        return this.closeEntityPropertiesModalRx;
    }
    closeEntityPropertiesModal(entity: LdapEntryNode) {
        return this._closeEntityPropertiesModalRx.next(entity);
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


    private _showCreateOuMenuRx = new Subject<LdapEntryNode>();
    get showCreateOuMenuRx(): Observable<LdapEntryNode> {
        return this._showCreateOuMenuRx.asObservable();
    }
    openCreateOu() {
        //throw new Error("Method not implemented.");
    }

    private _showCreateGroupOuRx = new Subject<LdapEntryNode>();
    get showCreateGroupMenuRx(): Observable<LdapEntryNode> {
        return this._showCreateGroupOuRx.asObservable();
    }
    openCreateGroup() {
        throw new Error("Method not implemented.");
    }

    private _showCreateUserRx = new Subject<LdapEntryNode>();
    get showCreateUserRx(): Observable<LdapEntryNode> {
        return this._showCreateUserRx.asObservable();
    }
    openCreateUser() {
        throw new Error("Method not implemented.");
    }
}