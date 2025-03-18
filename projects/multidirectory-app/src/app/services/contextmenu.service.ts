import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LdapEntryNode } from '@models/core/ldap/ldap-entity';

export interface ContextMenuRequest {
  openX: number;
  openY: number;
  entries: LdapEntryNode[];
}

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private _contextMenuOnNode = new Subject<ContextMenuRequest>();
  get contextMenuOnNodeRx(): Observable<ContextMenuRequest> {
    return this._contextMenuOnNode.asObservable();
  }
  showContextMenuOnNode(xPos: number, yPos: number, entries: LdapEntryNode[]) {
    return this._contextMenuOnNode.next({ entries, openX: xPos, openY: yPos });
  }
}
