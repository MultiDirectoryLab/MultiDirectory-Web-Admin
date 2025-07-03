import { AfterViewInit, Component, inject, OnDestroy, viewChild } from '@angular/core';
import { ContextMenuComponent } from '@components/modals/components/core/context-menu/context-menu.component';
import { ContextMenuService } from '@components/modals/services/context-menu.service';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { AppNavigationService } from '@services/app-navigation.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { RightClickEvent, Treenode, TreeviewComponent } from 'multidirectory-ui-kit';
import { from, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-navigation',
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html',
  imports: [TreeviewComponent],
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private currentLdapPosition: string = '';
  private treeView = viewChild.required<TreeviewComponent>('treeView');
  private navigation = inject(AppNavigationService);
  private ldap = inject(LdapTreeviewService);
  private contextMenu = inject(ContextMenuService);

  ldapTree: NavigationNode[] = [];

  ngAfterViewInit(): void {
    this.navigation.navigationEnd
      .pipe(
        takeUntil(this.unsubscribe),
        tap((x) => {
          const distinguishedName = this.navigation.snapshot.queryParams['distinguishedName'];
          this.currentLdapPosition = distinguishedName;
        }),
        switchMap((x) => {
          return from(this.ldap.load(this.currentLdapPosition));
        }),
        tap((x) => {
          if (!this.currentLdapPosition) {
            this.navigation.navigate(['ldap'], { distinguishedName: x[0].id });
          }
          this.ldap.setPathExpanded(this.currentLdapPosition);
          this.ldap.setSelected(this.currentLdapPosition);
        }),
      )
      .subscribe((x) => {
        this.ldapTree = x;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleNodeSelection(node: Treenode) {
    if (node instanceof NavigationNode) {
      this.navigation.navigate(node.route, node.routeData);
    }
  }

  handleNodeRightClick({ node, event: { x, y } }: RightClickEvent) {
    if (node instanceof NavigationNode) {
      this.contextMenu
        .open({
          component: ContextMenuComponent,
          x,
          y,
          contextMenuConfig: {
            hasBackdrop: false,
            data: { entity: [node] },
          },
        })
        .closed.pipe(switchMap((result) => (!result ? of(null) : of(result))))
        .subscribe();
    }
  }
}
