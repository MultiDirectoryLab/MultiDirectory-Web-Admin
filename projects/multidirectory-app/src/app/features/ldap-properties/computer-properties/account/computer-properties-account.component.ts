import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import BitSet from 'bitset';
import moment from 'moment';
import { ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-computer-properties-account',
  templateUrl: './computer-properties-account.component.html',
  styleUrls: ['./computer-properties-account.component.scss'],
})
export class ComputerPropertiesAccountComponent implements AfterViewInit {
  UserAccountControlFlag = UserAccountControlFlag;
  uacBitSet?: BitSet;
  accessor: LdapAttributes = {};

  get userShouldChangePassword(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.PASSWORD_EXPIRED) > 0
      ? true
      : false;
  }
  set userShouldChangePassword(shouldChange: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), shouldChange ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  fileTimeToDate(filetime: number): moment.Moment {
    return moment(new Date(filetime / 10000 - 11644473600000));
  }

  filetimeFromDate(date: moment.Moment): number {
    return date.date() * 1e4 + 116444736e9;
  }

  constructor(
    public modalControl: ModalInjectDirective,
    private cdr: ChangeDetectorRef,
    private nodeLoader: LdapEntryLoader,
  ) {}

  ngAfterViewInit(): void {
    this.accessor = this.modalControl.contentOptions.accessor;
    const uacBits = this.accessor['userAccountControl']?.[0];
    this.uacBitSet = !!this.accessor['userAccountControl']
      ? BitSet.fromHexString(Number(uacBits).toString(16))
      : new BitSet();

    this._accountExpires = !!Number(this.accessor['accountExpires']);
    this.cdr.detectChanges();
  }

  get passwordNeverExpires(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.DONT_EXPIRE_PASSWORD) > 0
      ? true
      : false;
  }
  set passwordNeverExpires(value: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.DONT_EXPIRE_PASSWORD), value ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  get storePasswordReversible(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT) >
      0
      ? true
      : false;
  }
  set storePasswordReversible(value: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT), value ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  get accountDisabled(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.ACCOUNTDISABLE) > 0
      ? true
      : false;
  }
  set accountDisabled(value: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.ACCOUNTDISABLE), value ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  _accountExpires = false;
  set accountExpires(value: boolean) {
    this._accountExpires = value;
    if (!value) {
      this.accessor['accountExpires'] = ['0'];
    } else {
      this.accessor['accountExpires'] = this.accessor['$accountExpires'];
    }
    this.cdr.detectChanges();
  }
  get accountExpires(): boolean {
    return this._accountExpires;
  }
}
