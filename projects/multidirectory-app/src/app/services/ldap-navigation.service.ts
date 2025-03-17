import { Injectable } from '@angular/core';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';
import { LdapNodePosition } from '@core/new-navigation/ldap-node-position/ldap-node-position';
import { delay, lastValueFrom, map, switchMap, take } from 'rxjs';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';

@Injectable({ providedIn: 'root' })
export class LdapNavigationService {
  public ldapTree: LdapEntryNode[] = [];

  constructor(private api: MultidirectoryApiService) {}

  async getRootDse(): Promise<LdapNodePosition[]> {
    const rootDse = await lastValueFrom(
      this.api.search(SearchQueries.RootDse).pipe(
        take(1),
        map((result) => result.search_result.map((x) => new LdapNodePosition(x.object_name))),
      ),
    );
    return rootDse;
  }

  async expendTree(currentLdapPosition: LdapNodePosition): Promise<void> {
    // buid a tree up to current ldap position, state-saving, starting form root dse
    this.ldapTree = [
      new LdapEntryNode({
        id: 'dc=test,dc=local',
        name: 'root',
        selectable: true,
        route: ['/'],
        type: LdapEntryType.Root,
        children: [
          new LdapEntryNode({
            id: 'dc=test,dc=local',
            name: 'root2',
            selectable: true,
            route: ['/'],
            type: LdapEntryType.Root,
          }),
        ],
      }),
    ];
    await setTimeout(() => {}, 1000);
  }
}
