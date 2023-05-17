import { Injectable } from "@angular/core";
import { Treenode } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SearchQueries } from "./search";
import { Observable, map } from "rxjs";
import { SearchEntry, SearchResponse } from "../../models/entry/search-response";
@Injectable({
    providedIn: 'root'
})
export class LdapTreeBuilder {
    constructor(private api: MultidirectoryApiService) {}

    getRoot(): Observable<Treenode[]> {
        return this.api.search(SearchQueries.RootDse).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const node = new Treenode({
                        name: 'RootDSE',
                    });
                    const namingContext = x.partial_attributes.find(x => x.type == 'namingContexts');
                    node.loadChildren = () => this.getChild(namingContext?.vals[0] ?? '');
                    return node;
                }    
            ))
        );
    }

    getChild(parent: string): Observable<Treenode[]> {
        return this.api.search(SearchQueries.getChild(parent)).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const displayName = this.getSingleAttribute(x, 'name');
                    const node = new Treenode({
                        name: displayName,
                        icon: '/assets/folder.svg'
                    });
                    node.loadChildren = () => this.getChild(x.object_name);
                    return node;
                }))
            );
    }

    private getSingleAttribute(entry: SearchEntry, attributeName: string): string {
        const partialAttribute = entry.partial_attributes.find(x => x.type == attributeName);
        return partialAttribute?.vals?.[0] ?? '';
    }
}