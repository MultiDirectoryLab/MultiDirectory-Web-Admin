import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { AppNavigationService } from '@services/app-navigation.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { RightClickEvent, Treenode, TreeviewComponent } from 'multidirectory-ui-kit';
import { from, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-navigation',
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html',
  imports: [TreeviewComponent],
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private currentLdapPosition: string = '';

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

  handleNodeExpantion(node: Treenode) {
    if (node instanceof NavigationNode) {
    }
  }

  handleNodeRightClick(event: RightClickEvent) {
    if (event.node instanceof NavigationNode) {
      this.contextMenu.showContextMenuOnNode(event.event.x, event.event.y, [event.node]);
    }
  }
}
