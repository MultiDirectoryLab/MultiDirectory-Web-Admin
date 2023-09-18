import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ChangeDescription } from "../core/ldap/ldap-change";
import { LdapEntity } from "../core/ldap/ldap-entity";
import { LdapAttributes, LdapAttributesProxyHandler } from "../core/ldap/ldap-entity-proxy";
import { PartialAttribute } from "../core/ldap/ldap-partial-attribute";
import { SearchQueries } from "../core/ldap/search";
import { LdapChange, LdapOperation, UpdateEntryRequest } from "../models/entry/update-request";
import { UpdateEntryResponse } from "../models/entry/update-response";
import { MultidirectoryApiService } from "./multidirectory-api.service";

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

    get(node: LdapEntity): Observable<LdapAttributes> {
        return this.load(node).pipe(map(props => {
            const attributes = new LdapAttributes(props);
            const handler = new LdapAttributesProxyHandler(node, attributes);
            return new Proxy(attributes, handler);
        }));
    }

    getChanges(attribute: LdapAttributes): ChangeDescription[] {
        // to add 
        const toAdd = Object.entries(attribute).filter((keyValue) => {
            const old = attribute['$' + keyValue[0]];
            return !old;
        }).map(keyValue => new ChangeDescription({
            operation: LdapOperation.Add,
            attribute: new PartialAttribute({
                type: keyValue[0],
                vals: keyValue[1]
            })
        }));

        const toReplace = Object.entries(attribute).filter((keyValue) => {
            const old = attribute['$' + keyValue[0]];
            return !!old && (old.length !== keyValue[1].length || !old.every((v,i)=> v === keyValue[1][i]));
        }).map(keyValue => new ChangeDescription({
            operation: LdapOperation.Replace,
            attribute: new PartialAttribute({
                type: keyValue[0],
                vals: keyValue[1]
            })
        }));
        const toDelete = Object.entries(attribute).filter((keyValue) => {
            const old = attribute['$' + keyValue[0]];
            return !!old && keyValue[1].length === 0;
        }).map(keyValue => new ChangeDescription({
            operation: LdapOperation.Delete,
            attribute: new PartialAttribute({
                type: keyValue[0],
                vals: keyValue[1]
            })
        }));
        return toAdd.concat(toReplace).concat(toDelete);
    }
    saveEntity(accessor: LdapAttributes): Observable<UpdateEntryResponse> {
        const changes = this.getChanges(accessor);
        const request = new UpdateEntryRequest({
            object: accessor['$entityDN'][0],
            changes: changes.map(x => new LdapChange({
                operation: x.operation!,
                modification: x.attribute!
            }))
        });
        return this.api.update(request);
    }
}