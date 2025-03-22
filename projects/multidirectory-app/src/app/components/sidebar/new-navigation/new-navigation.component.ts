import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { AppNavigationService } from '@services/app-navigation.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { RightClickEvent, Treenode } from 'multidirectory-ui-kit';
import { from, map, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-new-navigation',
  styleUrls: ['./new-navigation.component.scss'],
  templateUrl: './new-navigation.component.html',
})
export class NewNavigationComponent implements AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private currentLdapPosition: string = '';

  ldapTree: NavigationNode[] = [];

  constructor(
    private navigation: AppNavigationService,
    private activatedRoute: ActivatedRoute,
    private ldap: LdapTreeviewService,
    private contextMenu: ContextMenuService,
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe),
        tap((x) => {
          const distinguishedName = x['distinguishedName'];
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
      this.navigation.navigate(node);
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
