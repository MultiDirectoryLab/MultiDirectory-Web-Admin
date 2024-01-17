import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { TreeviewComponent } from "multidirectory-ui-kit";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { NavigationEnd, Router, RouterEvent, Scroll } from "@angular/router";
import { NavigationNode } from "../../../core/navigation/navigation-node";
import { TreeSearchHelper } from "projects/multidirectory-ui-kit/src/lib/components/treeview/core/tree-search-helper";

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
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef,
        private router: Router) {
        }
    
    ngOnInit(): void {
       this.initTree();
       this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe((event: any) => this.handleRouteChange(event))
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

    private initTree() {
        this.navigationTree = [
            new NavigationNode({ 
                id: 'root', 
                name: 'MultiDirectory',
                selectable: true,
                // route: root
                route: ['/'],
                children: [
                    new NavigationNode({
                        id: 'accessPolicy',
                        name: 'Access Policies',
                        selectable: true,
                        route: ['access-policy'],
                        // route: access policy
                        loadChildren: () => {
                            
                        }
                    }),
                    new NavigationNode({
                        id: 'savedQueries',
                        name: 'Saved Queries',
                        selectable: true,
                        route: ['/saved-queries'],
                    })
                ]
            })
        ]
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    handleNodeSelection(node: NavigationNode) {
        if(!!node.route) {
            this.router.navigate(node.route)
        }
    }
}