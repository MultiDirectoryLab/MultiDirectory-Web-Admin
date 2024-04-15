import { NavigationNode } from "../../../navigation-node";
import { Observable, map, of } from "rxjs";
import { NodeLoader } from "../../node-loader";
import { Injectable } from "@angular/core";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { translate } from "@ngneat/transloco";

@Injectable({
    providedIn: 'root'
})
export class AccessPolicyNodeLoader implements NodeLoader {
    constructor(private api: MultidirectoryApiService) {}

    get(): Observable<NavigationNode[]> {
        return of([
            new NavigationNode({
                id: 'accessPolicy',
                name: translate('navigation.policy-loader.access-policy-root-name'),
                selectable: true,
                route: ['access-policy'],
                icon: 'assets/lock.svg',
                loadChildren: this.getChildren.bind(this)
            })
        ])
    }

    getChildren(): Observable<NavigationNode[]> {
        const result = this.api.getAccessPolicy().pipe(
            map(
                x => x.map(policy => new NavigationNode({
                    id: 'policy ' + policy.id,
                    name: policy.name,
                    selectable: true,
                    expanded: true,
                    icon: 'assets/lock.svg',
                    route: ['access-policy', policy.id]
                }))
            )
        );
        return result;
    }
}