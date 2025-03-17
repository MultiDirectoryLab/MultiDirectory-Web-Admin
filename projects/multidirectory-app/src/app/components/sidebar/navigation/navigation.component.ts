import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { NavigationNode } from '@core/navigation/navigation-node';
import { AppNavigationService } from '@services/app-navigation.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { RightClickEvent, TreeSearchHelper, TreeviewComponent } from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navigation',
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnDestroy {
  @ViewChild('treeView', { static: true }) treeView!: TreeviewComponent;

  private unsubscribe = new Subject<void>();
  navigationTree: NavigationNode[] = [];

  constructor(
    private navigation: AppNavigationService,
    private contextMenu: ContextMenuService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  handleRouteChange(navigationTree: NavigationNode[], event: any) {
    let url = event.event.url;
    if (url.startsWith('/')) {
      url = url.substring(1);
    }
    TreeSearchHelper.traverseTreeRx<NavigationNode>(this.navigationTree, (node) => {
      let routeUrl = node.route.join('/');
      if (node.routeData && Object.entries(node.routeData).length > 0) {
        const entries = Object.entries(node.routeData);
        routeUrl +=
          '?' +
          entries
            .map(([k, v]) => {
              const encodedV = encodeURI(v).replace(/=/g, '%3D');
              return `${k}=${encodedV}`;
            })
            .join('&');
      }
      return url == routeUrl;
    }).subscribe((result) => {
      this.treeView.select(result);
    });
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
