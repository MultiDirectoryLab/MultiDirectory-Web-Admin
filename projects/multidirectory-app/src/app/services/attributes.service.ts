import { Injectable } from "@angular/core";
import { LdapEntity } from "../core/ldap/ldap-entity";
import { MultidirectoryApiService } from "./multidirectory-api.service";
import { SearchQueries } from "../core/ldap/search";
import { Observable, map, tap } from "rxjs";
import { PartialAttribute } from "../core/ldap/ldap-partial-attribute";
import { LdapEntityAccessor } from "../core/ldap/ldap-entity-accessor";
import { LdapChange, LdapOperation, UpdateEntryRequest } from "../models/entry/update-request";

@Injectable({
    providedIn: 'root'
})
export class AttributeService {
    constructor(private api: MultidirectoryApiService) {}

    load(node: LdapEntity): Observable<PartialAttribute[]> {
        return this.api.search(
            SearchQueries.getProperites(node.id ?? '')
        ).pipe(
            map(resp => {
                return resp.search_result[0].partial_attributes;
            })
        );
    }

    saveEntity(accessor: LdapEntityAccessor) {
        const changes = accessor.getChanges();
        const request = new UpdateEntryRequest({
            object: accessor.dn,
            changes: changes.map(x => new LdapChange({
                operation: x.operation!,
                modification: x.attribute!
            }))
        });
        return this.api.update(request);
    }
}