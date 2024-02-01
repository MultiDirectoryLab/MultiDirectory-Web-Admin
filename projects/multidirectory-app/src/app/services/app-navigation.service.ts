import { Injectable } from "@angular/core";
import { Observable, mergeMap, of, take, zip } from "rxjs";
import { NavigationNode } from "../core/navigation/navigation-node";
import { AccessPolicyNodeLoader } from "../core/navigation/node-loaders/policy-loaders/access-policy-node-loader/access-policy-node-loader";
import { LdapTreeLoader } from "../core/navigation/node-loaders/ldap-node-loader/ldap-node-loader";
import { NodeLoader } from "../core/navigation/node-loaders/node-loader";
import { SavedQueriesNodeLoader } from "../core/navigation/node-loaders/saved-query-node-loader/saved-query-node-loader";
import { PasswordPolicyNodeLoader } from "../core/navigation/node-loaders/policy-loaders/password-policy-node-loader/password-policy-node-loader";
import { PolicyNodeLoaders } from "../core/navigation/node-loaders/policy-loaders/policy-node-loader";

@Injectable({
    providedIn: 'root'
})
export class AppNavigationService {
    loaders: NodeLoader[] = [
        this.policyNodeLoader,
        new SavedQueriesNodeLoader(),
        this.ldapTreeLoader,
    ]

    constructor(
        private ldapTreeLoader: LdapTreeLoader,
        private policyNodeLoader: PolicyNodeLoaders) {}

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