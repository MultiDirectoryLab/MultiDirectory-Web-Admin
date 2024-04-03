import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { LdapEntryNode } from "../core/ldap/ldap-entity";

export interface ContextMenuRequest {
    openX: number;
    openY: number;
    entry: LdapEntryNode;
}

@Injectable({
    providedIn: 'root'
})
export class ContextMenuService {
    private _contextMenuOnNode = new Subject<ContextMenuRequest>();
    get contextMenuOnNodeRx(): Observable<ContextMenuRequest> {
        return this._contextMenuOnNode.asObservable();
    }
    showContextMenuOnNode(xPos: number, yPos: number, entry: LdapEntryNode) {
        return this._contextMenuOnNode.next({ entry, openX: xPos, openY: yPos });
    }
}