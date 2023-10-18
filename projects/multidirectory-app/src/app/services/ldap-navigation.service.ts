import { Injectable } from "@angular/core";
import { Page } from "multidirectory-ui-kit";
import { BehaviorSubject, EMPTY, Observable, Subject, lastValueFrom, of, skip, skipUntil, skipWhile, switchMap, take, tap } from "rxjs";
import { LdapLoader } from "../core/ldap/ldap-loader";
import { LdapNamesHelper } from "../core/ldap/ldap-names-helper";
import { LdapEntity } from "../core/ldap/ldap-entity";
import { LdapAttributes } from "../core/ldap/ldap-entity-proxy";
import { AttributeService } from "./attributes.service";

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
        private attributes: AttributeService) {}
    
    init() {
      this.ldap.getRoot()
        .subscribe(roots => {
            this._ldapRootRx.next(roots);
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
            if(!!currentNode.loadChildren && currentNode.children == null)
            {
                const childRx = currentNode.loadChildren();
                currentNode.children = !!childRx ? await lastValueFrom(childRx) : null;
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

    setEntityAccessor(entity?: LdapEntity): Observable<LdapAttributes | null> {
        if(!entity) {
            this._entityAccessorRx.next(null);
            return of(null);
        }
        return this.attributes.get(entity).pipe(take(1), tap(accessor => {
            this._entityAccessorRx.next(accessor);
        }));
    }

    _entityAccessorRx = new BehaviorSubject<LdapAttributes | null>(null);
    entityAccessorRx(): Observable<LdapAttributes | null> {
        return this._entityAccessorRx.asObservable();
    } 
}