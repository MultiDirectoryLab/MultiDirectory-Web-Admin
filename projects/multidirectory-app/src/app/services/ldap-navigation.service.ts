import { Injectable } from '@angular/core';
import { LdapEntryNode } from '@models/core/ldap/ldap-entity';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';
import { LdapNodePosition } from '@core/new-navigation/ldap-node-position/ldap-node-position';
import { delay, lastValueFrom, map, switchMap, take } from 'rxjs';
import { LdapEntryType } from '@models/core/ldap/ldap-entity-type';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { LdapSearchResultHelper } from '@core/ldap/ldap-search-result-helper';

@Injectable({ providedIn: 'root' })
export class LdapNavigationService {
  public ldapTree: LdapEntryNode[] = [];

  constructor(private api: MultidirectoryApiService) {}

  async getRootDse(): Promise<LdapNodePosition[]> {
    const rootDse = await lastValueFrom(
      this.api.search(SearchQueries.RootDse).pipe(
        take(1),
        map((result) => {
          console.log(result.search_result);
          return result.search_result.map((x) => {
            x.object_name = !!x.object_name
              ? x.object_name
              : LdapSearchResultHelper.getPartialAttributes(x, 'defaultNamingContext')?.[0];
            return new LdapNodePosition(x.object_name);
          });
        }),
      ),
    );
    return rootDse;
  }

  async expendTree(currentLdapPosition: LdapNodePosition): Promise<void> {
    // buid a tree up to current ldap position, state-saving, starting form root dse
    console.log(currentLdapPosition.dn);
    // select rootDSE
    const rootDse = await this.getRootDse();

    // map rootDSE to ldapNodePosition
  }
}
