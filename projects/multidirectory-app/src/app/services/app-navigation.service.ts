import { Injectable } from '@angular/core';
import { ActivatedRoute, Navigation, NavigationEnd, Router } from '@angular/router';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { NavigationRoot } from '@core/navigation/navigation-entry-point';
import { NavigationNode } from '@core/navigation/navigation-node';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { Observable, combineLatest, filter, lastValueFrom, map, of, startWith, take } from 'rxjs';
export interface NavigationEventWrapper {
  event: NavigationEnd;
  navigation: Navigation | null;
}
export type NavigationEvent = [NavigationNode[], NavigationEventWrapper];

@Injectable({
  providedIn: 'root',
})
export class AppNavigationService {
  private get _navigationEndRx() {
    return this.router.events.pipe(
      filter((x) => x instanceof NavigationEnd),
      map(
        (event) =>
          <NavigationEventWrapper>{
            event: event,
            navigation: this.router.getCurrentNavigation(),
          },
      ),
      startWith(<NavigationEventWrapper>{
        event: {
          id: 0,
          url: this.router.routerState.snapshot.url,
        },
      }),
    );
  }

  get navigationRx(): Observable<NavigationEvent> {
    return combineLatest<NavigationEvent>([this.navigationRoot.nodes, this._navigationEndRx]);
  }

  constructor(
    private router: Router,
    private navigationRoot: NavigationRoot,
    private activatedRoute: ActivatedRoute,
    private ldapTreeLoader: LdapEntryLoader,
  ) {}

  navigate(node: NavigationNode) {
    if (!node.route) {
      return;
    }
    this.router.navigate(node.route, {
      queryParams: {
        distinguishedName: node.data,
      },
    });
  }

  reload() {
    this.router.navigate([], {
      onSameUrlNavigation: 'reload',
      queryParams: this.activatedRoute.snapshot.queryParams,
      state: {
        reloadSelection: true,
      },
    });
  }

  async goTo(dn: string, rootDse: LdapEntryNode[] = []): Promise<LdapEntryNode | undefined> {
    const targetDnParts = LdapNamesHelper.getDnParts(dn);
    if (rootDse.length == 0) {
      rootDse = await lastValueFrom(this.ldapTreeLoader.get());
    }
    const selectedRoot = rootDse.find((x) =>
      LdapNamesHelper.dnContain(targetDnParts, LdapNamesHelper.getDnParts(x.id)),
    );
    while (targetDnParts.length > 0 && targetDnParts[targetDnParts.length - 1].type == 'dc')
      targetDnParts.pop();

    let currentNode = selectedRoot;
    let found: any;
    if (targetDnParts.length == 0) {
      return currentNode;
    }
    for (let i = 0; i < targetDnParts.length && currentNode; i++) {
      if (!!currentNode.loadChildren && currentNode.children.length == 0) {
        const childRx = currentNode.loadChildren();
        currentNode.children = !!childRx ? await lastValueFrom(childRx) : [];
      }

      if (!currentNode.children) {
        continue;
      }

      const children = currentNode.children.map((x) => {
        return {
          node: x,
          dn: LdapNamesHelper.getDnParts(x?.id ?? '').filter((x) => x.type !== 'dc'),
        };
      });

      found = children.find((x) => LdapNamesHelper.dnContain(targetDnParts, x.dn));
      if (!found && targetDnParts.length - i == 1) {
        const contentRx = this.ldapTreeLoader.getContent(currentNode.id);
        const searchContentResultRx = contentRx.pipe(
          take(1),
          map((x) => {
            const children = x.map((y) => {
              return {
                node: y,
                dn: LdapNamesHelper.getDnParts(y?.id ?? '').filter((z) => z.type !== 'dc'),
              };
            });
            const foundIndex = children.findIndex((x) =>
              LdapNamesHelper.dnEqual(targetDnParts, x.dn),
            );
            if (foundIndex > -1) {
              return children[foundIndex];
            }
            return;
          }),
        );
        const searchContentResult = await lastValueFrom(searchContentResultRx);
        if (searchContentResult) {
          return currentNode;
        }
      } else {
        currentNode = found?.node;
      }
    }
    if (!!currentNode && found && LdapNamesHelper.dnEqual(targetDnParts, found!.dn)) {
      return currentNode;
    }
    return;
  }

  private _ldapRoot: LdapEntryNode[] = [];
  getRoot(): Observable<LdapEntryNode[]> {
    if (this._ldapRoot.length !== 0) {
      return of(this._ldapRoot);
    }
    return this.ldapTreeLoader.get();
  }
}
