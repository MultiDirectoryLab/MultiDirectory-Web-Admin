import { Injectable } from "@angular/core";
import { Treenode } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SearchQueries } from "./search";
import { Observable, lastValueFrom, map, of } from "rxjs";
import { SearchResponse } from "../../models/entry/search-response";
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
                    const node = new Treenode({
                        name: x.object_name,
                    });
                    const namingContext = x.partial_attributes.find(x => x.type == 'namingContexts');
                    node.loadChildren = () => this.getChild(namingContext?.vals[0] ?? '');
                    return node;
                }))
            );
    }
}