import { inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, startWith, tap } from 'rxjs/operators';
import { LdapTreeviewService } from './ldap/ldap-treeview.service';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';

@Injectable({
  providedIn: 'root',
})
export class AppNavigationService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private treeview = inject(LdapTreeviewService);

  get navigationEnd(): Observable<NavigationEnd> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith({} as NavigationEnd),
    );
  }

  get url(): string {
    return this.router.url;
  }

  get snapshot(): ActivatedRouteSnapshot {
    return this.activatedRoute.snapshot;
  }

  navigate(route: string[], queryParams: Params) {
    if (!route) {
      return;
    }

    this.router.navigate(route, {
      queryParams: queryParams,
    });
  }

  reload() {
    this.router.navigateByUrl(this.router.url);
  }

  getContainer(): string {
    let parentDn = this.snapshot.queryParams['distinguishedName'];
    if (!this.treeview.isExpandable(parentDn)) {
      parentDn = LdapNamesHelper.getDnParent(parentDn);
    }
    return parentDn;
  }

  getDistinguishedName(): string {
    let parentDn = this.snapshot.queryParams['distinguishedName'];
    return parentDn;
  }

  isSelectEntry(): boolean {
    const isSelectEntry = this.snapshot.queryParams['select'] ?? false;
    return !!isSelectEntry && isSelectEntry !== '0';
  }
}
