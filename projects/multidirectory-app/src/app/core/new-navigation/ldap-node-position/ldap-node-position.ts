import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { SearchQueries } from '@core/ldap/search';
import { SearchResponse } from '@models/entry/search-response';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { lastValueFrom, map } from 'rxjs';

export class LdapNodePosition {
  static EMPTY = new LdapNodePosition('');

  constructor(public dn: string) {}

  getParent(): LdapNodePosition {
    const pdn = LdapNamesHelper.getDnParent(this.dn);
    return new LdapNodePosition(pdn);
  }

  async getChildren(api: MultidirectoryApiService): Promise<LdapNodePosition[]> {
    return await lastValueFrom(
      api.search(SearchQueries.getChildren(this.dn)).pipe(
        map((res: SearchResponse) =>
          res.search_result.map((x) => {
            const nodePosition = new LdapNodePosition(x.object_name);
            return nodePosition;
          }),
        ),
      ),
    );
  }

  async getNextSibling(api: MultidirectoryApiService): Promise<LdapNodePosition> {
    const parent = await this.getParent();
    const thisLevelChildren = await parent.getChildren(api);

    const index = thisLevelChildren.findIndex((x) => x.dn == this.dn);
    if (index >= thisLevelChildren.length - 1) {
      return new LdapNodePosition('');
    }
    return thisLevelChildren[index + 1];
  }

  async getPreviousSibling(api: MultidirectoryApiService): Promise<LdapNodePosition> {
    const parent = await this.getParent();
    const thisLevelChildren = await parent.getChildren(api);

    const index = thisLevelChildren.findIndex((x) => x.dn == this.dn);
    if (index <= 0) {
      return new LdapNodePosition('');
    }
    return thisLevelChildren[index - 1];
  }
}
