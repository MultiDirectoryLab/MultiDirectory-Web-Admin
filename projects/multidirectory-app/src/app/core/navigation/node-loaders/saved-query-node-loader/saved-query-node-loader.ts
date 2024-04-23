import { NavigationNode } from "@core/navigation/navigation-node";
import { Observable, of } from "rxjs";
import { NodeLoader } from "../node-loader";

export class SavedQueriesNodeLoader implements NodeLoader {
    get(): Observable<NavigationNode[]> {
        return of([
            new NavigationNode({
                id: 'savedQueries',
                name: 'Saved Queries',
                selectable: true,
                route: [''],
                icon: 'assets/snippet_folder.svg'
                //loadChildren: this.getChildren.bind(this)
            })
        ])
    }

}