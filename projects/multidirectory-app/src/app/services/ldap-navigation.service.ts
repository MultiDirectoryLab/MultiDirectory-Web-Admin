import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { LdapNode, LdapLoader, NodeSelection } from "../core/ldap/ldap-loader";
import { Page, Treenode } from "multidirectory-ui-kit";
import { BehaviorSubject, Observable, Subject, lastValueFrom, of, take, tap } from "rxjs";
import { LdapNamesHelper } from "../core/ldap/ldap-names-helper";

@Injectable({
    providedIn: 'root'
})
export class LdapNavigationService {
    private _ldapRootRx = new BehaviorSubject<LdapNode[]>([]);
    get ldapRootRx(): Observable<LdapNode[]> {
        return this._ldapRootRx.asObservable();
    }
    get ldapRoot(): LdapNode[] {
        return this._ldapRootRx.value;
    }

    private _nodeSelected = new Subject<NodeSelection>();
    get nodeSelected(): Observable<NodeSelection> {
        return this._nodeSelected.asObservable();
    }

    constructor(private ldap: LdapLoader) {}
    
    init() {
        this.ldap.getRoot().subscribe(roots => {
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
                const contentRx = this.ldap.getContent(currentNode.id, currentNode as LdapNode);
                contentRx.pipe(take(1)).subscribe(x => {
                    const children = x.map(y => {
                        return {
                            node: y,
                            dn: LdapNamesHelper.getDnParts(y?.id ?? '').filter(z => z.type !== 'dc')
                        }
                    });
                    const ldapNode = <LdapNode>currentNode!;
                    ldapNode.childCount = x.length;
                    const foundIndex = children.findIndex(x => LdapNamesHelper.dnEqual(dnParts, x.dn));
                    if(foundIndex > -1) {
                        this._nodeSelected.next({
                            parent: ldapNode, 
                            node: children[foundIndex].node,
                            page: new Page({
                                pageNumber: Math.floor(foundIndex / 10) + 1,
                                totalElements: x.length,
                                size: 10
                            })
                        });
                    }
                })
                return;
            } else {
                currentNode = found?.node;
            }
        }
        if(!!currentNode && found && LdapNamesHelper.dnEqual(dnParts, found!.dn)) {
            this._nodeSelected.next({ parent: <LdapNode>currentNode, node: undefined });
        }
    }

    setCatalog(catalog: LdapNode) {
        this._nodeSelected.next({ 
            parent: catalog, 
            node: undefined 
        });
    }

    getContent(catalog: LdapNode, page: Page): Observable<LdapNode[]> {
        return this.ldap.getContent(catalog.id, catalog, page);
    }
}