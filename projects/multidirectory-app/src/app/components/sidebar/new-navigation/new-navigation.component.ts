import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapNodePosition } from '@core/new-navigation/ldap-node-position/ldap-node-position';
import { LdapNavigationService } from '@services/ldap-navigation.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { from, map, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-new-navigation',
  styleUrls: ['./new-navigation.component.scss'],
  templateUrl: './new-navigation.component.html',
})
export class NewNavigationComponent implements AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private currentLdapPosition: LdapNodePosition = LdapNodePosition.EMPTY;

  public get ldapTree(): LdapEntryNode[] {
    return this.ldap.ldapTree;
  }

  constructor(
    private api: MultidirectoryApiService,
    private activatedRoute: ActivatedRoute,
    private ldap: LdapNavigationService,
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe),
        tap((x) => {
          const distinguishedName = x['distinguishedName'];
          this.currentLdapPosition = new LdapNodePosition(distinguishedName);
        }),
        switchMap((x) => {
          return from(this.ldap.expendTree(this.currentLdapPosition));
        }),
      )
      .subscribe((x) => {});
  }

  async traverseTree(level: LdapNodePosition): Promise<LdapEntryNode[]> {
    const parent = level.getParent();
    if (parent.dn) {
      this.traverseTree(parent);
    }
    let children = await parent.getChildren(this.api);
    return [];
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
