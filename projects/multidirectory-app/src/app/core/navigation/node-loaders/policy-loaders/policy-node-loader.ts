import { Observable, flatMap, mergeMap, of, take, zip } from "rxjs";
import { NavigationNode } from "../../navigation-node";
import { NodeLoader } from "../node-loader";
import { Injectable } from "@angular/core";
import { AccessPolicyNodeLoader } from "./access-policy-node-loader/access-policy-node-loader";
import { PasswordPolicyNodeLoader } from "./password-policy-node-loader/password-policy-node-loader";
import { translate } from "@ngneat/transloco";

@Injectable({
    providedIn: 'root'
})
export class PolicyNodeLoaders implements NodeLoader {
    policyLoaders: NodeLoader[] = [
        this.accessPolicyNodeLoader,
        this.passwordPolicyNodeLoader,
    ]   

    constructor(
        private accessPolicyNodeLoader: AccessPolicyNodeLoader,
        private passwordPolicyNodeLoader: PasswordPolicyNodeLoader) {}
    get(): Observable<NavigationNode[]> {
        return of([
            new NavigationNode({
                name: translate('navigation.policy-loader.root-node-name'),
                icon: 'assets/keyicons.svg',
                id: 'server-policy-root',
                loadChildren: () => this.getChildren()
            })
        ]);
    }

    getChildren(): Observable<NavigationNode[]> {
        const branches = this.policyLoaders.map(x => x.get());

        return zip(branches).pipe(
            take(1),
            mergeMap(x => of(x.flatMap(y => y)))
        );
    }
}