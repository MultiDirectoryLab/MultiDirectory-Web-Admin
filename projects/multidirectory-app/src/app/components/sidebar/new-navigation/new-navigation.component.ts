import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { LdapTreeService } from '@services/ldap/ldap-tree.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { from, map, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-new-navigation',
  styleUrls: ['./new-navigation.component.scss'],
  templateUrl: './new-navigation.component.html',
})
export class NewNavigationComponent implements AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private currentLdapPosition: string = '';
  getLdapLevel(dn: string): NavigationNode[] {
    return [];
  }

  constructor(
    private api: MultidirectoryApiService,
    private activatedRoute: ActivatedRoute,
    private ldap: LdapTreeService,
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
      .subscribe((x) => {});
  }

  onExpandClick(node: NavigationNode) {
    alert(node.id);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
