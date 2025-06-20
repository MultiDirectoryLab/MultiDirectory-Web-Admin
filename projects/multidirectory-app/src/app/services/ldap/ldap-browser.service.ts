import { Injectable } from '@angular/core';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { LdapSearchResultHelper } from '@core/ldap/ldap-search-result-helper';
import { SearchQueries } from '@core/ldap/search';
import { LdapBrowserEntry } from '@models/core/ldap-browser/ldap-browser-entry';
import { LdapEntry } from '@models/core/ldap/ldap-entry';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { lastValueFrom, map, of, tap, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LdapBrowserService {
  constructor(private api: MultidirectoryApiService) {}

  async loadContent(
    parentDn: string,
    query: string,
    offset = 0,
    limit = 1,
  ): Promise<[LdapBrowserEntry[], number, number]> {
    const request = SearchQueries.getContent(parentDn, query, offset, limit);

    const response = await lastValueFrom(this.api.search(request));
    const ldapEntries = response.search_result
      .map((x) => {
        const objectClass = LdapSearchResultHelper.getLdapAttributes(
          x.partial_attributes,
          'objectClass',
        );
        return new LdapEntry({
          dn: x.object_name,
          objectClasses: objectClass,
          attributes: x.partial_attributes,
          type: EntityInfoResolver.getNodeType(objectClass),
        });
      })
      .map(
        (x) =>
          new LdapBrowserEntry({
            description: EntityInfoResolver.getNodeDescription(x),
            dn: x.dn,
            icon: EntityInfoResolver.resolveIcon(x.type),
            name: LdapNamesHelper.getDnName(x.dn).split('=')[1],
          }),
      );

    return [ldapEntries, response.total_pages, response.total_objects];
  }

  // pdn        |
  // query      |--->
  // page_size  |
}
