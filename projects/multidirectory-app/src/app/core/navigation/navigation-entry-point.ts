import { Injectable } from "@angular/core";
import { Observable, mergeMap, of, take, zip } from "rxjs";
import { NavigationNode } from "./navigation-node";
import { LdapEntryLoader } from "./node-loaders/ldap-entry-loader/ldap-entry-loader";
import { NodeLoader } from "./node-loaders/node-loader";
import { PolicyNodeLoaders } from "./node-loaders/policy-loaders/policy-node-loader";
import { SavedQueriesNodeLoader } from "./node-loaders/saved-query-node-loader/saved-query-node-loader";

@Injectable({
    providedIn: 'root'
})
export class NavigationRoot {
    private loaders: NodeLoader[] = [
        this.policyNodeLoader,
        new SavedQueriesNodeLoader(),
        this.ldapTreeLoader,
    ]

    constructor(
        private ldapTreeLoader: LdapEntryLoader,
        private policyNodeLoader: PolicyNodeLoaders) {}

    get nodes(): Observable<NavigationNode[]> {
        const branches = this.loaders.map(x => x.get());
        return zip(branches)
            .pipe(
                take(1),        
                mergeMap((result) => {
                    return of(result.flatMap(x => x));
                })
            );
    }
}