import { Observable, of } from "rxjs";
import { NavigationNode } from "../../navigation-node";
import { NodeLoader } from "../node-loader";

export class SavedQueriesNodeLoader implements NodeLoader {
    get(): Observable<NavigationNode[]> {
        return of([
            new NavigationNode({
                id: 'savedQueries',
                name: 'Saved Queries',
                selectable: true,
                route: ['saved-queries'],
                //loadChildren: this.getChildren.bind(this)
            })
        ])
    }

}