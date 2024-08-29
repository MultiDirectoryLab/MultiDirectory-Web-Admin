import { Injectable } from '@angular/core';
import { BulkPerformStrategy } from '../bulk-perfrom-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { BitSet } from 'bitset';

@Injectable({
  providedIn: 'root',
})
export class DisableAccountStrategy extends BulkPerformStrategy<LdapAttributes> {
  UserAccountControlFlag = UserAccountControlFlag;

  constructor() {
    super();
  }

  override mutate<TARGET>(accessor: LdapAttributes): TARGET {
    const uacBitSet = !!accessor['userAccountControl']
      ? BitSet.fromHexString(Number(accessor['userAccountControl']?.[0]).toString(16))
      : new BitSet();
    const value =
      (Number(uacBitSet?.toString(10)) & UserAccountControlFlag.ACCOUNTDISABLE) > 0 ? true : false;

    uacBitSet.set(Math.log2(UserAccountControlFlag.ACCOUNTDISABLE), value ? 0 : 1);

    accessor['userAccountControl'] = [uacBitSet?.toString(10)];
    return accessor as TARGET;
  }
}
