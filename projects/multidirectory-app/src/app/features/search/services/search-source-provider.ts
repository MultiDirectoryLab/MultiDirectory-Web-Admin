import { Injectable } from "@angular/core";
import { SearchSource } from "../models/search-source";
import { SearchType } from "../models/search-type";
import { LdapEntryLoader } from "../../../core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader";
import { Observable, map, of } from "rxjs";
import { LdapEntryNode } from "../../../core/ldap/ldap-entity";


@Injectable()
export class SearchSourceProvider {
    constructor(private ldap: LdapEntryLoader) {}

    getSearchSources(type: SearchType): Observable<SearchSource[]> {
        if(type == SearchType.Ldap) {
            return this.getLdapSources()
        }

        if(type == SearchType.Policies) {
            // TODO
            return of([])
        }
        return of([]);
    }

    private getLdapSources(): Observable<SearchSource[]> {
        const mapNode = (nodes: LdapEntryNode[]) => nodes.map(x => new SearchSource({
            title: x.name,
            type: SearchType.Ldap,
            data: x
        }))
        return this.ldap.get().pipe(map(mapNode));
    }
}