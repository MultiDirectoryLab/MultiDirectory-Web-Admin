import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { BulkCompleteStrategy } from '../bulk-complete-strategy';
import { Observable, of } from 'rxjs';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { BitSet } from 'bitset';

export class CheckAccountEnabledStateStrategy extends BulkCompleteStrategy<LdapAttributes> {
  override complete<RESULT>(entires: LdapAttributes[]): Observable<RESULT> {
    if (entires.length == 0) {
      return of(null as RESULT);
    }
    const result = entires.map((accessor) => {
      const uacBitSet = !!accessor['userAccountControl']
        ? BitSet.fromHexString(Number(accessor['userAccountControl']?.[0]).toString(16))
        : new BitSet();
      const value =
        (Number(uacBitSet?.toString(10)) & UserAccountControlFlag.ACCOUNTDISABLE) > 0
          ? false
          : true;
      return value;
    });
    const isEvery = result.every((x) => x) as RESULT;
    return of(isEvery);
  }
}
