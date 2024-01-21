import { Treenode } from "multidirectory-ui-kit";
import { NavigationNode } from "../../navigation-node";
import { Observable, of } from "rxjs";
import { NodeLoader } from "../node-loader";

export class AccessPolicyNodeLoader implements NodeLoader {
    get(): Observable<NavigationNode[]> {
        return of([
            new NavigationNode({
                id: 'accessPolicy',
                name: 'Access Policies',
                selectable: true,
                route: ['access-policy'],
                loadChildren: this.getChildren.bind(this)
            })
        ])
    }

    getChildren(): Observable<Treenode[]> {
        return of([])
    }
}