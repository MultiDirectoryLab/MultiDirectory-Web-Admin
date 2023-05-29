import { Injectable, Output } from "@angular/core";
import { LdapNode } from "./ldap-tree-builder";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LdapNavigator {
    currentNode?: LdapNode;
    @Output() currentNodeChanged = new Subject<LdapNode>();

    setCurrentNode() {
        // todo
    }
}