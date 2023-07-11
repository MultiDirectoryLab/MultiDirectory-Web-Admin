import { EventEmitter, Injectable } from "@angular/core";
import { LdapNode, LdapTreeBuilder } from "../core/ldap/ldap-tree-builder";
import { Page, Treenode } from "multidirectory-ui-kit";
import { lastValueFrom, take } from "rxjs";

interface DnPart {
    type: string;
    value: string;
}

interface NodeSelection {
    node: LdapNode | undefined,
    parent: LdapNode 
}

@Injectable({
    providedIn: 'root'
})
export class LdapNavigationService {
    ldapRoot: Treenode[] | undefined;
    nodeSelected = new EventEmitter<NodeSelection>();

    constructor(private ldap: LdapTreeBuilder) {}

    private getDnParts(dn: string): DnPart[] {
        const rawDnParts = dn.split(',').map(x => x.trim().split('='));
        const dnParts = rawDnParts.map(element => {
            return { type: element[0], value: element[1]};
        });
        return dnParts;
    }

    private dnContain(left: DnPart[], right: DnPart[]) {
        return left.map(x => x.value).join('.').includes(right.map(x => x.value).join('.'));
    }

    private dnEqual(left: DnPart[], right: DnPart[]) {
        return left.map(x => x.value).join('.') == right.map(x => x.value).join('.');
    }
    
    async goTo(dn: string) {
        if(!this.ldapRoot) throw Error('Ldap root not found');
        const rootDse = this.ldapRoot.flatMap(x => x.children?.filter(x => x.id !== 'saved'));
        const rootDseDNs = rootDse.map(x => { 
            return {
                node: x,
                dn: this.getDnParts(x?.id ?? '')
            }
        });
        const dnParts = this.getDnParts(dn);
        const selectedRoot = rootDseDNs.find(x => this.dnContain(dnParts, x.dn));
        while(dnParts[dnParts.length - 1].type == 'dc' && dnParts.length > 0)
            dnParts.pop();
        console.log(dnParts);  
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
                    dn: this.getDnParts(x?.id ?? '').filter(x => x.type !== 'dc')
                }
            });
            found = children.find(x => this.dnContain(dnParts, x.dn));
            if(!found && dnParts.length - i == 1) {
                const allPage: Page = { pageNumber: 0, size: 10000, totalElements: 10000 } 
                const contentRx = this.ldap.getContent(currentNode.id, currentNode as LdapNode, allPage);
                contentRx.pipe(take(1)).subscribe(x => {
                    const children = x.map(y => {
                        return {
                            node: y,
                            dn: this.getDnParts(y?.id ?? '').filter(z => z.type !== 'dc')
                        }
                    });
                    const found = children.find(x => this.dnEqual(dnParts, x.dn));
                    if(found) {
                        this.nodeSelected.emit({ parent: <LdapNode>currentNode, node: found.node });
                    }
                })
            } else {
                currentNode = found?.node;
            }
        }
        if(!!currentNode && found && this.dnEqual(dnParts, found!.dn)) {
            this.nodeSelected.emit({ parent: <LdapNode>currentNode, node: undefined });
        }
    }
}