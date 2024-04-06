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


    private _showCreateOuMenuRx = new Subject<string>();
    private _closeCreateOuMenuRx = new Subject<string>();
    get showCreateOuMenuRx(): Observable<string> {
        return this._showCreateOuMenuRx.asObservable();
    }
    get closeCreateOuMenuRx(): Observable<string> {
        return this._closeCreateOuMenuRx.asObservable();
    }
    openCreateOu(parentDn: string) {
        this._showCreateOuMenuRx.next(parentDn);
        return this.closeCreateOuMenuRx;
    }
    closeCreateOu(parentDn: string) {
        return this._closeCreateOuMenuRx.next(parentDn);
    }


    private _showCreateUserMenuRx = new Subject<string>();
    private _closeCreateUserMenuRx = new Subject<string>();
    get showCreateUserMenuRx(): Observable<string> {
        return this._showCreateUserMenuRx.asObservable();
    }
    get closeCreateUserMenuRx(): Observable<string> {
        return this._closeCreateUserMenuRx.asObservable();
    }
    openCreateUser(parentDn: string) {
        this._showCreateUserMenuRx.next(parentDn);
        return this.closeCreateUserMenuRx;
    }
    closeCreateUser(parentDn: string) {
        return this._closeCreateUserMenuRx.next(parentDn);
    }

    
    private _showCreateGroupMenuRx = new Subject<string>();
    private _closeCreateGroupMenuRx = new Subject<string>();
    get showCreateGroupMenuRx(): Observable<string> {
        return this._showCreateGroupMenuRx.asObservable();
    }
    get closeCreateGroupMenuRx(): Observable<string> {
        return this._closeCreateGroupMenuRx.asObservable();
    }
    openCreateGroup(parentDn: string) {
        this._showCreateGroupMenuRx.next(parentDn);
        return this.closeCreateGroupMenuRx;
    }
    closeCreateGroup(parentDn: string) {
        return this._closeCreateGroupMenuRx.next(parentDn);
    }


    private _showCreateComputerMenuRx = new Subject<string>();
    private _closeCreateComputerMenuRx = new Subject<string>();
    get showCreateComputerMenuRx(): Observable<string> {
        return this._showCreateComputerMenuRx.asObservable();
    }
    get closeCreateComputerMenuRx(): Observable<string> {
        return this._closeCreateComputerMenuRx.asObservable();
    }
    openCreateComputer(parentDn: string) {
        this._showCreateComputerMenuRx.next(parentDn);
        return this.closeCreateComputerMenuRx;
    }
    closeCreateComputer(parentDn: string) {
        return this._closeCreateOuMenuRx.next(parentDn);
    }
}