import { Observable, map, of } from "rxjs";
import { NavigationNode } from "../../../navigation-node";
import { NodeLoader } from "../../node-loader";
import { Injectable } from "@angular/core";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { translate } from "@ngneat/transloco";

@Injectable({
    providedIn: 'root'
})
export class PasswordPolicyNodeLoader implements NodeLoader
{
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
        const result = this.api.getAccessPolicy().pipe(
            map(
                x => x.map(policy => new NavigationNode({
                    id: 'password-policy ' + policy.id,
                    name: policy.name,
                    selectable: true,
                    expanded: true,
                    icon: 'assets/keyicons.svg',
                    route: ['password-policy', policy.id]
                }))
            )
        );
        return result;
    }
}