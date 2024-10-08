import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RightClickEvent, TreeSearchHelper, TreeviewComponent } from 'multidirectory-ui-kit';
import { AppNavigationService, NavigationEventWrapper } from '@services/app-navigation.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { NavigationNode } from '@core/navigation/navigation-node';
import { LdapEntryNode } from '@core/ldap/ldap-entity';

@Component({
  selector: 'app-navigation',
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit, OnDestroy {
  @ViewChild('treeView', { static: true }) treeView!: TreeviewComponent;

  private unsubscribe = new Subject<void>();
  navigationTree: NavigationNode[] = [];

  constructor(
    private navigation: AppNavigationService,
    private contextMenu: ContextMenuService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.navigation.navigationRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([navigationTree, navigationEvent]) => {
        this.navigationTree = navigationTree;
        this.handleRouteChange(navigationTree, navigationEvent);
      });
  }

  handleRouteChange(navigationTree: NavigationNode[], event: NavigationEventWrapper) {
    let url = event.event.url;
    const rootDse = navigationTree[2] as LdapEntryNode;

    if (url.startsWith('/')) {
      url = url.substring(1);
    }
    // Поиск узла для выбора в дереве
    let node: NavigationNode | undefined;
    // Что у нас есть в node, по чему мы можем идентифицировать узел?
    if (url == '') {
      this.treeView.select(null);
      return;
    }
    if (url == 'ldap') {
      this.navigation.navigate(rootDse);
      return;
    }
    if (url.startsWith('ldap?')) {
      const dn = this.route.snapshot.queryParams['distinguishedName'];
      this.navigation.goTo(dn, [rootDse]).then((node) => {
        if (!node) {
          return;
        }
        const reloadSelection = event.navigation?.extras?.state?.['reloadSelection'] ?? false;
        if (!node.selected || reloadSelection) {
          this.treeView.select(node);
        }
      });
      return;
    }
    TreeSearchHelper.traverseTree<NavigationNode>(
      this.navigationTree,
      (n: NavigationNode, path) => {
        n.selected = false;
        if (!n.route) {
          return;
        }
        // Что такое nodeUrl?
        let nodeUrl = n.route.join('/');
        if (nodeUrl.startsWith('/')) {
          nodeUrl = nodeUrl.substring(1);
        }
        // Мы ищем узел в LDAP каталоге по query и это плохо
        if (nodeUrl == url) {
          node = n;
        }
      },
    );
    if (!!node) {
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

  handleNodeRightClick(event: RightClickEvent) {
    if (event.node instanceof LdapEntryNode) {
      this.treeView.focus(event.node);
      this.contextMenu.showContextMenuOnNode(event.event.x, event.event.y, [event.node]);
    }
  }
}
