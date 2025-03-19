import { Injectable } from '@angular/core';
import { ContextMenuRequest } from '@models/core/context-menu/context-menu-request';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private _contextMenuOnNode = new Subject<ContextMenuRequest>();
  get contextMenuOnNodeRx(): Observable<ContextMenuRequest> {
    return this._contextMenuOnNode.asObservable();
  }
  showContextMenuOnNode(xPos: number, yPos: number, entries: NavigationNode[]) {
    return this._contextMenuOnNode.next({ entries, openX: xPos, openY: yPos });
  }
}
