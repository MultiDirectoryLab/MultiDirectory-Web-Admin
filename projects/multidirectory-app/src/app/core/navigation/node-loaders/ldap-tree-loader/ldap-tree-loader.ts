import { Page, Treenode } from "multidirectory-ui-kit";
import { Observable, map, tap } from "rxjs";
import { Router } from "@angular/router";
import { NodeLoader } from "../node-loader";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { Injectable } from "@angular/core";
import { LdapEntity } from "../../../ldap/ldap-entity";
import { SearchQueries } from "../../../ldap/search";
import { SearchEntry, SearchResponse } from "projects/multidirectory-app/src/app/models/entry/search-response";
import { LdapEntityType } from "../../../ldap/ldap-entity-type";
import { EntityInfoResolver } from "../../../ldap/entity-info-resolver";
 
@Injectable({
    providedIn: 'root'
})
export class LdapTreeLoader implements NodeLoader {
    constructor(private api: MultidirectoryApiService, private router: Router) {}

    get(): Observable<LdapEntity[]> {
        return this.api.search(SearchQueries.RootDse).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                   
                    const namingContext = x.partial_attributes.find(x => x.type == 'namingContexts');
                    const serverNode = new LdapEntity({ 
                            name: LdapTreeLoader.getSingleAttribute(x, 'dnsHostName'),
                            type: LdapEntityType.Server,
                            selectable: true,
                            entry: x,
                            parent: undefined, 
                            id: namingContext?.vals[0] ?? ''
                        },
                    );
                    serverNode.loadChildren = () => this.getChild(namingContext?.vals[0] ?? '', serverNode);
 
                    return serverNode;
                }    
            ))
        );
    }

    getChild(dn: string, parent: LdapEntity | undefined = undefined): Observable<Treenode[]> {
        return this.api.search(SearchQueries.getChild(dn)).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const displayName = LdapTreeLoader.getSingleAttribute(x, 'name');
                    const objectClass =  x.partial_attributes.find(x => x.type == 'objectClass');
                    const node = new LdapEntity({
                        name: displayName,
                        type: EntityInfoResolver.getNodeType(objectClass?.vals),
                        selectable: true,
                        entry: x,
                        id: x.object_name,
                        parent: parent
                    });
                    node.loadChildren = () => this.getChild(x.object_name, node);
                    return node;
                }))
            );
    }


    getContent(parent: string, parentNode: LdapEntity, page?: Page): Observable<LdapEntity[]> {
        return this.api.search(SearchQueries.getContent(parent, page)).pipe(
            tap(x => parentNode.childCount = x.total_objects ),
            map((res: SearchResponse) => res.search_result.map(x => {
                    const displayName = LdapTreeLoader.getSingleAttribute(x, 'name');
                    const objectClass =  x.partial_attributes.find(x => x.type == 'objectClass');
                    const node = new LdapEntity({
                        name: displayName,
                        type: EntityInfoResolver.getNodeType(objectClass?.vals), 
                        selectable: true,
                        expandable: EntityInfoResolver.isExpandable(objectClass?.vals),
                        entry: x,
                        id: x.object_name,
                        parent: parentNode
                    });
                    node.loadChildren = () => this.getChild(x.object_name);
                    return node;
                }))
            );
    }

    static getSingleAttribute(entry: SearchEntry, attributeName: string): string {
        const partialAttribute = entry.partial_attributes.find(x => x.type == attributeName);
        return partialAttribute?.vals?.[0] ?? '';
    }
}