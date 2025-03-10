import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, concat, concatAll, forkJoin, map, Subject, takeUntil } from 'rxjs';
import {
  RightClickEvent,
  Treenode,
  TreeSearchHelper,
  TreeviewComponent,
} from 'multidirectory-ui-kit';
import { AppNavigationService, NavigationEventWrapper } from '@services/app-navigation.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { NavigationNode } from '@core/navigation/navigation-node';
import { LdapEntryNode } from '@core/ldap/ldap-entity';

@Component({
  selector: 'app-navigation',
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('treeView', { static: true }) treeView!: TreeviewComponent;

  private unsubscribe = new Subject<void>();
  navigationTree: NavigationNode[] = [];

  constructor(
    private navigation: AppNavigationService,
    private contextMenu: ContextMenuService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngAfterViewInit(): void {
    this.navigation.navigationRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([navigationTree, navigationEvent]) => {
        this.navigationTree = navigationTree;
        this.cdr.detectChanges();
        this.handleRouteChange(navigationTree, navigationEvent);
      });
  }

  handleRouteChange(navigationTree: NavigationNode[], event: NavigationEventWrapper) {
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
