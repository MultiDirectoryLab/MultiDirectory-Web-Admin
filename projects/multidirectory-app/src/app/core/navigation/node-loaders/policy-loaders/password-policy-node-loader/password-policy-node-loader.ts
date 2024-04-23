import { Observable, map, of } from "rxjs";
import { Injectable } from "@angular/core";
import { MultidirectoryApiService } from "@services/multidirectory-api.service";
import { translate } from "@ngneat/transloco";
import { NavigationNode } from "@core/navigation/navigation-node";
import { NodeLoader } from "../../node-loader";

@Injectable({
    providedIn: 'root'
})
export class PasswordPolicyNodeLoader implements NodeLoader {
    constructor(private api: MultidirectoryApiService) {}
    
    get(): Observable<NavigationNode[]> {
        return of([
            new NavigationNode({
                id: 'password-policy-root',
                name: translate('navigation.policy-loader.password-policy-root-node'),
                route: ['password-policy'],
                selectable: true,
                icon: 'assets/keyicons.svg',
                loadChildren: this.getChildren.bind(this)
            })
        ]);
    }

    getChildren(): Observable<NavigationNode[]> {
        const result = this.api.getPasswordPolicy().pipe(
            map(
                policy => [new NavigationNode({
                    id: 'password-policy ' + policy.id,
                    name: policy.name,
                    selectable: true,
                    expanded: true,
                    icon: 'assets/keyicons.svg',
                    route: ['password-policy', policy.id]
                })]
            )
        );
        return result;
    }
}