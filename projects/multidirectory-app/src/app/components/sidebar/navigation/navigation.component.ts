import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, EventType, NavigationEnd, Params, Router, RouterEvent, Scroll } from "@angular/router";
import { TreeviewComponent } from "multidirectory-ui-kit";
import { TreeSearchHelper } from "projects/multidirectory-ui-kit/src/lib/components/treeview/core/tree-search-helper";
import { Subject, combineLatest, take, takeUntil } from "rxjs";
import { LdapEntryNode } from "../../../core/ldap/ldap-entity";
import { NavigationNode } from "../../../core/navigation/navigation-node";
import { AppNavigationService } from "../../../services/app-navigation.service";
import { NavigationRoot } from "../../../core/navigation/navigation-entry-point";

@Component({
    selector: 'app-navigation',
    styleUrls: ['./navigation.component.scss'],
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
    @ViewChild('treeView', { static: true } ) treeView!: TreeviewComponent;
    private unsubscribe = new Subject<void>();
    navigationTree: NavigationNode[] = []

    constructor(private navigation: AppNavigationService) {
    }   
    
    ngOnInit(): void {
        this.navigation.navigationRx
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([navigationTree, navigationEvent, query]) => {
                this.navigationTree = navigationTree;
                this.handleRouteChange(navigationTree, navigationEvent, query);
            });
    }

    handleRouteChange(navigationTree: NavigationNode[], event: RouterEvent, queryParams: Params) {
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
        // Поиск узла для выбора в дереве
        let node: NavigationNode | undefined;
        // Что у нас есть в node, по чему мы можем идентифицировать узел?
        if(url == '') {
            this.treeView.select(null);
            return;
        }
        if(url.startsWith('ldap?')) {
            const dn = queryParams['distinguishedName'];
            this.navigation.goTo(dn, [navigationTree[2] as LdapEntryNode]).then(node => {
                if(!node) {
                    return;
                }
                this.treeView.select(node);
            });
            return;
        }
        TreeSearchHelper.traverseTree<NavigationNode>(this.navigationTree, (n: NavigationNode, path) => {
            n.selected = false;
            if(!n.route) {
                return;
            }
            // Что такое nodeUrl?
            let nodeUrl = n.route.join('/')
            if(nodeUrl.startsWith('/')) {
                nodeUrl = nodeUrl.substring(1);
            }
            // Мы ищем узел в LDAP каталоге по query и это плохо
            if(nodeUrl == url) {
                node = n;
            }
        });
        if(!!node) {
            this.treeView.select(node);
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    handleNodeSelection(node: NavigationNode) {
        this.navigation.navigate(node);
    }
}