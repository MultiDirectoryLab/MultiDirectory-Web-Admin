import { Injectable } from '@angular/core';
import { MultidirectoryApiService } from '../multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';
import { lastValueFrom, map, take } from 'rxjs';
import { LdapSearchResultHelper } from '@core/ldap/ldap-search-result-helper';
import { LdapEntry } from '@models/core/ldap/ldap-entry';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';

@Injectable({ providedIn: 'root' })
export class LdapTreeService {
  private _ldapMap = new Map<string, LdapEntry>();

  constructor(private api: MultidirectoryApiService) {}

  private async loadInner(dn: string): Promise<string[]> {
    const searchQuery = !dn ? SearchQueries.RootDse : SearchQueries.getChildren(dn);
    const searchResult = await lastValueFrom(
      this.api.search(searchQuery).pipe(
        take(1),
        map((result) => {
          return result.search_result;
        }),
      ),
    );

    let children: string[] = [];
    for (let resultEntry of searchResult) {
      const objectClass = LdapSearchResultHelper.getPartialAttributes(
        resultEntry.partial_attributes,
        'objectClass',
      );

      const rootDSEAwareDn = !!resultEntry.object_name
        ? resultEntry.object_name
        : (LdapSearchResultHelper.getPartialAttributes(
            resultEntry.partial_attributes,
            'rootDomainNamingContext',
          )?.[0] ?? '');

      const ldapEntry = new LdapEntry({
        dn: rootDSEAwareDn,
        objectClasses: objectClass,
        attributes: resultEntry.partial_attributes,
        type: EntityInfoResolver.getNodeType(objectClass),
      });

      this._ldapMap.set(resultEntry.object_name, ldapEntry);

      if (!dn) {
        this._ldapMap.set('', ldapEntry);
      }

      children.push(rootDSEAwareDn);
    }
    return children;
  }

  async load(dn: string): Promise<string[]> {
    let currentDn = dn;
    let expanded: string[] = [];
    do {
      expanded = expanded.concat(await this.loadInner(currentDn));
      currentDn = LdapNamesHelper.getDnParent(currentDn);
    } while (!!currentDn);

    if (!this._ldapMap.has('')) {
      await this.loadInner('');
    }

    return expanded;
  }

  getEntries(): Map<string, LdapEntry> {
    return this._ldapMap;
  }
}
