import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { AppNavigationService } from '@services/app-navigation.service';
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
          return from(this.ldap.expand(this.currentLdapPosition));
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

  async handleNodeExpand(node: Treenode) {
    if (node instanceof NavigationNode) {
      this.ldapTree = await this.ldap.expand(node.name);
    }
  }

  handleNodeSelection(node: Treenode) {
    if (node instanceof NavigationNode) {
      this.navigation.navigate(node);
    }
  }

  handleNodeRightClick(event: RightClickEvent) {
    if (event.node instanceof NavigationNode) {
    }
  }
}
