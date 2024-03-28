import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Params, Router, Scroll } from "@angular/router";
import { Treenode } from "multidirectory-ui-kit";
import { Observable, combineLatest, debounce, debounceTime, filter, lastValueFrom, map, merge, of, startWith, take, tap, zip } from "rxjs";
import { LdapEntryNode } from "../core/ldap/ldap-entity";
import { NavigationNode } from "../core/navigation/navigation-node";
import { NavigationRoot } from "../core/navigation/navigation-entry-point";
import { LdapNamesHelper } from "../core/ldap/ldap-names-helper";
import { LdapEntryLoader } from "../core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader";

export type NavigationEvent = [NavigationNode[], NavigationEnd, Params]

@Injectable({
    providedIn: 'root'
})
export class AppNavigationService {
    private get _navigationEndRx() {
        return this.router.events.pipe(
            filter((event): event is Scroll => event instanceof Scroll),
            filter((event): event is Scroll => event.routerEvent instanceof NavigationEnd),
            map(event => event.routerEvent as NavigationEnd),
            startWith(new NavigationEnd(0, '' , ''))
        );
    }

    private get _queryRx() {
        return  this.activatedRoute.queryParams.pipe(startWith({}));
    }

    get navigationRx(): Observable<NavigationEvent> {
        return combineLatest<NavigationEvent>([this.navigationRoot.nodes, this._navigationEndRx, this._queryRx]).pipe(debounceTime(50))
    }
    
    constructor(
        private router: Router,
        private navigationRoot: NavigationRoot,
        private activatedRoute: ActivatedRoute,
        private ldapTreeLoader: LdapEntryLoader) {}

    navigate(node: NavigationNode) {
        if(!node.route) {
            return;
        }
        this.router.navigate(node.route, { 
            queryParams: { 
                "distinguishedName": node.data 
            }
        });
    }
    
    reload() {
        this.router.navigate([], {onSameUrlNavigation: 'reload'});
    }

    async goTo(rootDse: LdapEntryNode[], dn: string): Promise<LdapEntryNode | undefined> {
        const targetDnParts = LdapNamesHelper.getDnParts(dn);
        const selectedRoot = rootDse.find(x => LdapNamesHelper.dnContain(targetDnParts, LdapNamesHelper.getDnParts(x.id)));
        while(targetDnParts.length > 0 && targetDnParts[targetDnParts.length - 1].type == 'dc')
            targetDnParts.pop();
        
        let currentNode = selectedRoot;
        let found: any;
        if(targetDnParts.length == 0) {
            //this.setCatalog(<LdapEntryNode>currentNode, null, null);
            return;
        }
        for(let i = 0; i < targetDnParts.length && currentNode; i++) {
            if(!!currentNode.loadChildren && currentNode.children.length == 0)
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
            
            found = children.find(x => LdapNamesHelper.dnContain(targetDnParts, x.dn));
            if(!found && targetDnParts.length - i == 1) {
                const contentRx = this.ldapTreeLoader.getContent(currentNode.id);
                contentRx.pipe(take(1)).subscribe(x => {
                    const children = x.map(y => {
                        return {
                            node: y,
                            dn: LdapNamesHelper.getDnParts(y?.id ?? '').filter(z => z.type !== 'dc')
                        }
                    });
                    const ldapNode = <LdapEntryNode>currentNode!;
                    const foundIndex = children.findIndex(x => LdapNamesHelper.dnEqual(targetDnParts, x.dn));
                    if(foundIndex > -1) {
                        // found
                    }
                })
                return;
            } else {
                currentNode = found?.node;
            }
        }
        if(!!currentNode && found && LdapNamesHelper.dnEqual(targetDnParts, found!.dn)) {
            //this.setCatalog(<LdapEntryNode>currentNode, null, null);
            return currentNode;
        }
        return;
    }


    async getEntityByDn(dn: string): Promise<Treenode | undefined> {
        /*if(!this.ldapRoot) throw Error('Ldap root not found');

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
                const contentRx = this.ldapTreeLoader.getContent(currentNode.id, currentNode as LdapEntryNode);
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
        }*/
        return undefined;
    }

}