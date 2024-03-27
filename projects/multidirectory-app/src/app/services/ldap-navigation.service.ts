import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Page, Treenode } from "multidirectory-ui-kit";
import { BehaviorSubject, Observable, Subject, lastValueFrom, map, take } from "rxjs";
import { LdapEntryNode } from "../core/ldap/ldap-entity";
import { LdapNamesHelper } from "../core/ldap/ldap-names-helper";
import { LdapEntryLoader } from "../core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader";

@Injectable({
    providedIn: 'root'
})
export class LdapNavigationService {
    private _ldapRootRx = new BehaviorSubject<LdapEntryNode[]>([]);
    get ldapRootRx(): Observable<LdapEntryNode[]> {
        return this._ldapRootRx.asObservable();
    }
    get ldapRoot(): LdapEntryNode[] {
        return this._ldapRootRx.value;
    }

    private _selectedCatalogRx = new BehaviorSubject<LdapEntryNode | null>(null);
    get selectedCatalogRx(): Observable<LdapEntryNode | null> {
        return this._selectedCatalogRx.asObservable();
    }
    private _selectedCatalog: LdapEntryNode | null = null;
    get selectedCatalog(): LdapEntryNode | null {
        return this._selectedCatalog;
    }

    private _selectedEntityRx = new Subject<LdapEntryNode[] | null>();
    get selectedEntityRx(): Observable<LdapEntryNode[] | null> {
        return this._selectedEntityRx.asObservable();
    }
    private _selectedEntity: LdapEntryNode[] | null = null;
    get selectedEntity(): LdapEntryNode[] | null {
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
        private ldap: LdapEntryLoader) {}
    
    setRootDse(root: LdapEntryNode[]) {
        this._ldapRootRx.next(root)
    }

    getRootDse() {
        if(!this.ldapRoot) {
            throw Error('Ldap root not found');
        }
        return this.ldapRoot.map(x => { 
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
        while(dnParts.length > 0 && dnParts[dnParts.length - 1].type == 'dc')
            dnParts.pop();
        
        let currentNode = selectedRoot?.node;
        let found: any;
        if(dnParts.length == 0) {
            this.setCatalog(<LdapEntryNode>currentNode, null, null);
            return;
        }
        for(let i = 0; i < dnParts.length && currentNode; i++) {
            if(!!currentNode.loadChildren && !currentNode.children)
            {
                const childRx = currentNode.loadChildren();
                currentNode.children = !!childRx ? await lastValueFrom(childRx) : [];
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
                const contentRx = this.ldap.getContent(currentNode.id, currentNode as LdapEntryNode);
                contentRx.pipe(take(1)).subscribe(x => {
                    const children = x.map(y => {
                        return {
                            node: y,
                            dn: LdapNamesHelper.getDnParts(y?.id ?? '').filter(z => z.type !== 'dc')
                        }
                    });
                    const ldapNode = <LdapEntryNode>currentNode!;
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
            this.setCatalog(<LdapEntryNode>currentNode, null, null);
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
            if(!!currentNode.loadChildren)
            {
                const childRx = currentNode.loadChildren();
                currentNode.children = !!childRx ? await lastValueFrom(childRx) : [];
            }

            if(currentNode.children.length == 0) {
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
                const contentRx = this.ldap.getContent(currentNode.id, currentNode as LdapEntryNode);
                return await lastValueFrom(contentRx.pipe(take(1)).pipe(map(x => {
                    const children = x.map(y => {
                        return {
                            node: y,
                            dn: LdapNamesHelper.getDnParts(y?.id ?? '').filter(z => z.type !== 'dc')
                        }
                    });
                    const ldapNode = <LdapEntryNode>currentNode!;
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

    setCatalog(catalog: LdapEntryNode | null, page: Page | null = null, selection: LdapEntryNode[] | null = null) {
        if(!page) {
            page = new Page(this.page);
            page.pageNumber = 1;
        } 
        this._page = page;
        this._selectedEntity = selection;
        this._selectedCatalog = catalog;
        this._selectedCatalogRx.next(this._selectedCatalog);
    }

    setPage(page: Page | null = null, selection: LdapEntryNode[] | null = null) {
        if(!page) {
            page =  new Page(this.page);
            page.pageNumber = 1;
        }
        this._page = page;
        this._selectedEntity = selection;
        this._pageRx.next(this._page);
    }

    setSelection(selection: LdapEntryNode[] | null = null) {
        this._selectedEntity = selection;
        this._selectedEntityRx.next(this._selectedEntity);
    }

    getContent(catalog: LdapEntryNode, page: Page): Observable<LdapEntryNode[]> {
        return this.ldap.getContent(catalog.id, catalog, page);
    }
}