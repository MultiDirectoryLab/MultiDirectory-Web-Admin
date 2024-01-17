import { Injectable } from "@angular/core";
import { Page, Treenode } from "multidirectory-ui-kit";
import { BehaviorSubject, EMPTY, Observable, Subject, lastValueFrom, map, of, skip, skipUntil, skipWhile, switchMap, take, tap } from "rxjs";
import { LdapLoader } from "../core/ldap/ldap-loader";
import { LdapNamesHelper } from "../core/ldap/ldap-names-helper";
import { LdapEntity } from "../core/ldap/ldap-entity";
import { LdapAttributes } from "../core/ldap/ldap-entity-proxy";
import { AttributeService } from "./attributes.service";
import { LdapEntityType } from "../core/ldap/ldap-entity-type";
import { translate } from "@ngneat/transloco";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LdapNavigationService {
    private _ldapRootRx = new BehaviorSubject<LdapEntity[]>([]);
    get ldapRootRx(): Observable<LdapEntity[]> {
        return this._ldapRootRx.asObservable();
    }
    get ldapRoot(): LdapEntity[] {
        return this._ldapRootRx.value;
    }

    private _selectedCatalogRx = new Subject<LdapEntity | null>();
    get selectedCatalogRx(): Observable<LdapEntity | null> {
        return this._selectedCatalogRx.asObservable();
    }
    private _selectedCatalog: LdapEntity | null = null;
    get selectedCatalog(): LdapEntity | null {
        return this._selectedCatalog;
    }

    private _selectedEntityRx = new Subject<LdapEntity[] | null>();
    get selectedEntityRx(): Observable<LdapEntity[] | null> {
        return this._selectedEntityRx.asObservable();
    }
    private _selectedEntity: LdapEntity[] | null = null;
    get selectedEntity(): LdapEntity[] | null {
        return this._selectedEntity;
    }

    private _pageRx = new Subject<Page>();
    get pageRx(): Observable<Page> {
        return this._pageRx.asObservable();
    }
    private _page = new Page;
    get page(): Page {
        return this._page;
    }

    constructor(
        private ldap: LdapLoader,
        private router: Router) {}
    
    init() {
      return this.ldap.getRoot()
        .subscribe(servers => {
            const root = new LdapEntity({
                name: translate('ldap-builder.root-dse-name'),
                type: LdapEntityType.Root,
                expanded: true,
                id: 'root'
            });
            servers.forEach(x => x.parent  = root);

            root.children = [
                new LdapEntity({ name: translate("ldap-builder.saved-queries"), type: LdapEntityType.Folder, selectable: true, id: 'saved', parent: root }),
                new LdapEntity({ 
                    name: translate("ldap-builder.access-policies"), 
                    type: LdapEntityType.Folder, 
                    selectable: true, 
                    id: 'access-policy', 
                    parent: root,
                    clickAction: (node) => { 
                        this.router.navigate(['/access-policy']).then(x => {
                            if(x) {
                                this.setSelection([node])
                            }
                        })
                    }
                }),
                ...servers
            ];
            this._ldapRootRx.next([root]);
        });   
    }

    getRootDse() {
        if(!this.ldapRoot) throw Error('Ldap root not found');

        const rootDse = this.ldapRoot.flatMap(x => x.children?.filter(x => x.id !== 'saved'));
        return rootDse.map(x => { 
            return {
                node: x,
                dn: LdapNamesHelper.getDnParts(x?.id ?? '')
            }
        });
    }

    async goTo(dn: string) {
        if(!this.ldapRoot) throw Error('Ldap root not found');

        const rootDseDNs = this.getRootDse();

        const dnParts = LdapNamesHelper.getDnParts(dn);
        const selectedRoot = rootDseDNs.find(x => LdapNamesHelper.dnContain(dnParts, x.dn));
        while(dnParts[dnParts.length - 1].type == 'dc' && dnParts.length > 0)
            dnParts.pop();
        
        let currentNode = selectedRoot?.node;
        let found: any;

        for(let i = 0; i < dnParts.length && currentNode; i++) {
            if(!!currentNode.loadChildren && !currentNode.children)
            {
                const childRx = currentNode.loadChildren();
                currentNode.children = !!childRx ? await lastValueFrom(childRx) : undefined;
                currentNode.childrenLoaded = true;
            }

            if(!currentNode.children) {
                continue;
            }

            const children = currentNode.children.map(x => {
                return {
                    node: x,
                    dn: LdapNamesHelper.getDnParts(x?.id ?? '').filter(x => x.type !== 'dc')
                }
            });
            
            found = children.find(x => LdapNamesHelper.dnContain(dnParts, x.dn));
            if(!found && dnParts.length - i == 1) {
                const contentRx = this.ldap.getContent(currentNode.id, currentNode as LdapEntity);
                contentRx.pipe(take(1)).subscribe(x => {
                    const children = x.map(y => {
                        return {
                            node: y,
                            dn: LdapNamesHelper.getDnParts(y?.id ?? '').filter(z => z.type !== 'dc')
                        }
                    });
                    const ldapNode = <LdapEntity>currentNode!;
                    ldapNode.childCount = x.length;
                    const foundIndex = children.findIndex(x => LdapNamesHelper.dnEqual(dnParts, x.dn));
                    if(foundIndex > -1) {
                        this.setCatalog(
                            ldapNode, 
                            new Page({
                                pageNumber: Math.floor(foundIndex / this.page.size) + 1,
                                totalElements: x.length,
                                size: this.page.size
                            }),
                            [children[foundIndex].node]
                        );
                    }
                })
                return;
            } else {
                currentNode = found?.node;
            }
        }
        if(!!currentNode && found && LdapNamesHelper.dnEqual(dnParts, found!.dn)) {
            this.setCatalog(<LdapEntity>currentNode, null, null);
        }
    }


    async getEntityByDn(dn: string): Promise<Treenode | undefined> {
        if(!this.ldapRoot) throw Error('Ldap root not found');

        const rootDseDNs = this.getRootDse();

        const dnParts = LdapNamesHelper.getDnParts(dn);
        const selectedRoot = rootDseDNs.find(x => LdapNamesHelper.dnContain(dnParts, x.dn));
        while(dnParts[dnParts.length - 1].type == 'dc' && dnParts.length > 0)
            dnParts.pop();
        
        let currentNode = selectedRoot?.node;
        let found: any;

        for(let i = 0; i < dnParts.length && currentNode; i++) {
            if(!!currentNode.loadChildren && !currentNode.children)
            {
                const childRx = currentNode.loadChildren();
                currentNode.children = !!childRx ? await lastValueFrom(childRx) : undefined;
                currentNode.childrenLoaded = true;
            }

            if(!currentNode.children) {
                continue;
            }

            const children = currentNode.children.map(x => {
                return {
                    node: x,
                    dn: LdapNamesHelper.getDnParts(x?.id ?? '').filter(x => x.type !== 'dc')
                }
            });
            
            found = children.find(x => LdapNamesHelper.dnContain(dnParts, x.dn));
            if(!found && dnParts.length - i == 1) {
                const contentRx = this.ldap.getContent(currentNode.id, currentNode as LdapEntity);
                return await lastValueFrom(contentRx.pipe(take(1)).pipe(map(x => {
                    const children = x.map(y => {
                        return {
                            node: y,
                            dn: LdapNamesHelper.getDnParts(y?.id ?? '').filter(z => z.type !== 'dc')
                        }
                    });
                    const ldapNode = <LdapEntity>currentNode!;
                    ldapNode.childCount = x.length;
                    const foundIndex = children.findIndex(x => LdapNamesHelper.dnEqual(dnParts, x.dn));
                    if(foundIndex > -1) {
                        return children[foundIndex].node;
                    }
                    return undefined;
                })));
            } else {
                currentNode = found?.node;
            }
        }
        if(!!currentNode && found && LdapNamesHelper.dnEqual(dnParts, found!.dn)) {
            return currentNode;
        }
        return undefined;
    }

    setCatalog(catalog: LdapEntity | null, page: Page | null = null, selection: LdapEntity[] | null = null) {
        if(!page) {
            page = new Page(this.page);
            page.pageNumber = 1;
        } 
        this._page = page;
        this._selectedEntity = selection;
        this._selectedCatalog = catalog;
        this._selectedCatalogRx.next(this._selectedCatalog);
    }

    setPage(page: Page | null = null, selection: LdapEntity[] | null = null) {
        if(!page) {
            page =  new Page(this.page);
            page.pageNumber = 1;
        }
        this._page = page;
        this._selectedEntity = selection;
        this._pageRx.next(this._page);
    }

    setSelection(selection: LdapEntity[] | null = null) {
        this._selectedEntity = selection;
        this._selectedEntityRx.next(this._selectedEntity);
    }

    getContent(catalog: LdapEntity, page: Page): Observable<LdapEntity[]> {
        return this.ldap.getContent(catalog.id, catalog, page);
    }
}