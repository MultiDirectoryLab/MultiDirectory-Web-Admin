import { Injectable } from "@angular/core";
import { NavigationNode } from "../core/navigation/navigation-node";
import { AccessPolicyNodeLoader } from "../core/navigation/node-loaders/access-policy/access-policy-node-loader";
import { NodeLoader } from "../core/navigation/node-loaders/node-loader";
import { SavedQueriesNodeLoader } from "../core/navigation/node-loaders/saved-query/saved-query-node-loader";
import { Observable, combineLatestAll, concat, mergeMap, of, take, zip } from "rxjs";
import { LdapTreeLoader } from "../core/navigation/node-loaders/ldap-tree-loader/ldap-tree-loader";

@Injectable({
    providedIn: 'root'
})
export class AppNavigationService {
    loaders: NodeLoader[] = [
        new AccessPolicyNodeLoader(),
        new SavedQueriesNodeLoader(),
        this.ldapTreeLoader
    ]

    constructor(private ldapTreeLoader: LdapTreeLoader) {}

    buildNavigationRoot(): Observable<NavigationNode[]> {
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