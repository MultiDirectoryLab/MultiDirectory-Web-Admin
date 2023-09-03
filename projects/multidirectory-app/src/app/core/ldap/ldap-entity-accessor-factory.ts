import { Injectable } from "@angular/core";
import { AttributeService } from "../../services/attributes.service";
import { LdapEntity } from "./ldap-entity";
import { Observable, map } from "rxjs";
import { LdapEntityAccessor } from "./ldap-entity-accessor";

@Injectable({
    providedIn: 'root'
})
export class LdapEntityAccessorFactory {
    constructor(private attributes: AttributeService) {}

    get(node: LdapEntity): Observable<LdapEntityAccessor> {
        return this.attributes.load(node).pipe(map(props => new LdapEntityAccessor(node, props)));
    }
}