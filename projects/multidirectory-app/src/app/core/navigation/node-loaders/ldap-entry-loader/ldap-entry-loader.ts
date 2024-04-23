import { Observable, map, tap } from "rxjs";
import { MultidirectoryApiService } from "@services/multidirectory-api.service";
import { Injectable } from "@angular/core";
import { SearchEntry, SearchResponse } from "@models/entry/search-response";
import { Page, Treenode } from "multidirectory-ui-kit";
import { EntityInfoResolver } from "@core/ldap/entity-info-resolver";
import { LdapEntryNode } from "@core/ldap/ldap-entity";
import { LdapEntryType } from "@core/ldap/ldap-entity-type";
import { SearchQueries } from "@core/ldap/search";
import { NodeLoader } from "../node-loader";
 
@Injectable({
    providedIn: 'root'
})
export class LdapEntryLoader implements NodeLoader {
    constructor(private api: MultidirectoryApiService) {}

    get(): Observable<LdapEntryNode[]> {
        return this.api.search(SearchQueries.RootDse).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const namingContext = x.partial_attributes.find(x => x.type == 'namingContexts');
                    const rootDn = x.partial_attributes.find(x => x.type == 'rootDomainNamingContext');

                    const serverNode = new LdapEntryNode({ 
                            name: LdapEntryLoader.getSingleAttribute(x, 'dnsHostName'),
                            type: LdapEntryType.Server,
                            selectable: true,
                            entry: x,
                            parent: undefined, 
                            id: namingContext?.vals[0] ?? '',
                            route: ['ldap'],
                            data: rootDn?.vals?.[0] ?? ''
                        },
                    );
                    serverNode.loadChildren = () => this.getChild(namingContext?.vals[0] ?? '', serverNode);
                    return serverNode;
                }    
            ))
        );
    }

    getChild(dn: string, parent: LdapEntryNode | undefined = undefined): Observable<Treenode[]> {
        return this.api.search(SearchQueries.getChild(dn)).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const displayName = LdapEntryLoader.getSingleAttribute(x, 'name');
                    const objectClass =  x.partial_attributes.find(x => x.type == 'objectClass')!;
                    const node = new LdapEntryNode({
                        name: displayName,
                        type: EntityInfoResolver.getNodeType(objectClass.vals),
                        selectable: true,
                        entry: x,
                        id: x.object_name,
                        parent: parent,
                        route: ['ldap'],
                        data: x.object_name
                    });
                    node.loadChildren = () => this.getChild(x.object_name, node);
                    return node;
                }))
            );
    }

    getContent(parent: string): Observable<LdapEntryNode[]> {
        return this.api.search(SearchQueries.getContent(parent)).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const displayName = LdapEntryLoader.getSingleAttribute(x, 'name');
                    const objectClass =  x.partial_attributes.find(x => x.type == 'objectClass')!;
                    const node = new LdapEntryNode({
                        name: displayName,
                        type: EntityInfoResolver.getNodeType(objectClass.vals), 
                        selectable: true,
                        expandable: EntityInfoResolver.isExpandable(objectClass?.vals),
                        entry: x,
                        id: x.object_name,
                        route: ['ldap'],
                        data: x.object_name
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