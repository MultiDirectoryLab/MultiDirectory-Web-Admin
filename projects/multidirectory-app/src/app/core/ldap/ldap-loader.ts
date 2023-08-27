import { Injectable } from "@angular/core";
import { Page, Treenode } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SearchQueries } from "./search";
import { Observable, map, tap } from "rxjs";
import { SearchEntry, SearchResponse } from "../../models/entry/search-response";
import { LdapNodeType, EntityInfoResolver } from "./entity-info-resolver";


export class LdapEntity extends Treenode {
    type: LdapNodeType = LdapNodeType.None;
    entry?: SearchEntry;
    icon?;
    override parent: LdapEntity | null = null;
    childCount?: number;
    constructor(obj: Partial<LdapEntity>) {
        super({});
        Object.assign(this, obj);
        this.icon = EntityInfoResolver.resolveIcon(this.type);
    }
}

export interface DnPart {
    type: string;
    value: string;
}

@Injectable({
    providedIn: 'root'
})
export class LdapLoader {
    constructor(private api: MultidirectoryApiService) {}

    getRoot(): Observable<LdapEntity[]> {
        return this.api.search(SearchQueries.RootDse).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const root = new LdapEntity({
                        name: 'Пользователи Multidirectory',
                        type: LdapNodeType.Root,
                        expanded: true,
                        id: 'root'
                    });
                    const namingContext = x.partial_attributes.find(x => x.type == 'namingContexts');
                    const serverNode = new LdapEntity({ 
                            name: this.getSingleAttribute(x, 'dnsHostName'),
                            type: LdapNodeType.Server,
                            selectable: true,
                            entry: x,
                            parent: root, 
                            id: namingContext?.vals[0] ?? ''
                        },
                    );
                    serverNode.loadChildren = () => this.getChild(namingContext?.vals[0] ?? '', serverNode);

                    root.children = [
                        new LdapEntity({ name: 'Cохраненные запросы', type: LdapNodeType.Folder, selectable: true, id: 'saved', parent: root }),
                        serverNode,
                    ]
                    return root;
                }    
            ))
        );
    }

    getChild(dn: string, parent: LdapEntity | null = null): Observable<Treenode[]> {
        return this.api.search(SearchQueries.getChild(dn)).pipe(
            map((res: SearchResponse) => res.search_result.map(x => {
                    const displayName = this.getSingleAttribute(x, 'name');
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
                    const displayName = this.getSingleAttribute(x, 'name');
                    const objectClass =  x.partial_attributes.find(x => x.type == 'objectClass');
                    const node = new LdapEntity({
                        name: displayName,
                        type: EntityInfoResolver.getNodeType(objectClass?.vals), 
                        selectable: true,
                        entry: x,
                        id: x.object_name,
                        parent: parentNode
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