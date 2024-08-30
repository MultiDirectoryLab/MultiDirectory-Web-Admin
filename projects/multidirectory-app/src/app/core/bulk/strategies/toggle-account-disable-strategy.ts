import { Injectable } from '@angular/core';
import { BulkPerformStrategy } from '../bulk-perfrom-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { BitSet } from 'bitset';

export class ToggleAccountDisableStrategy extends BulkPerformStrategy<LdapAttributes> {
  UserAccountControlFlag = UserAccountControlFlag;
  private _enable = false;
  constructor(enable: boolean) {
    super();
    this._enable = enable;
  }

  override mutate<TARGET>(accessor: LdapAttributes): TARGET {
    const uacBitSet = !!accessor['userAccountControl']
      ? BitSet.fromHexString(Number(accessor['userAccountControl']?.[0]).toString(16))
      : new BitSet();

    uacBitSet.set(Math.log2(UserAccountControlFlag.ACCOUNTDISABLE), this._enable ? 0 : 1);

    accessor['userAccountControl'] = [uacBitSet?.toString(10)];
    return accessor as TARGET;
  }
}
