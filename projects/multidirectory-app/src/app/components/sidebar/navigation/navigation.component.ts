import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, take, takeUntil } from "rxjs";
import { TreeviewComponent } from "multidirectory-ui-kit";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { NavigationEnd, Router, RouterEvent, Scroll } from "@angular/router";
import { NavigationNode } from "../../../core/navigation/navigation-node";
import { TreeSearchHelper } from "projects/multidirectory-ui-kit/src/lib/components/treeview/core/tree-search-helper";
import { AppNavigationService } from "../../../services/app-navigation.service";
import { LdapEntity } from "../../../core/ldap/ldap-entity";

@Component({
    selector: 'app-navigation',
    styleUrls: ['./navigation.component.scss'],
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
    @ViewChild('treeView', { static: true } ) treeView?: TreeviewComponent;
    private unsubscribe = new Subject<void>();
    navigationTree: NavigationNode[] = []

    constructor(
        private navigation: AppNavigationService,
        private ldapNavigation: LdapNavigationService,
        private cdr: ChangeDetectorRef,
        private router: Router) {
        }
    
    ngOnInit(): void {
        this.navigation.buildNavigationRoot().pipe(take(1)).subscribe(x => {
            this.navigationTree = x;
            const rootDse = <LdapEntity[]>x.filter(x => x instanceof LdapEntity);
            this.ldapNavigation.setRootDse(rootDse);
        });
        this.router.events.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe((event: any) => {
            this.handleRouteChange(event);
        })
    }

    handleRouteChange(event: RouterEvent) {
        if(event instanceof Scroll) {
            event = event.routerEvent;
        }
        if(!(event instanceof NavigationEnd)) {
            return
        }
        let url = event.urlAfterRedirects;
        if(url.startsWith('/')) {
            url = url.substring(1);
        }
        let node: NavigationNode = new NavigationNode({});
        TreeSearchHelper.traverseTree(this.navigationTree, (n: NavigationNode, path) => {
            n.selected = false;
            if(!n.route) {
                return;
            }
            let nodeUrl = n.route.join('/')
            if(nodeUrl.startsWith('/')) {
                nodeUrl = nodeUrl.substring(1);
            }
            if(nodeUrl == url) {
                node = n;
            }
        });
        this.treeView?.selectNode(node);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    handleNodeSelection(node: NavigationNode) {
        if(!!node.route) {
            this.router.navigate(node.route, { 
                queryParams: { 
                    "distinguishedName": node.data 
                }
            });
        }
    }
}