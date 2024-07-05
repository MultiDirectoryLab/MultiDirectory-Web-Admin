import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import BitSet from 'bitset';
import { DropdownOption, ModalInjectDirective } from 'multidirectory-ui-kit';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { AttributeService } from '@services/attributes.service';
import { take, tap } from 'rxjs';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import moment from 'moment';

@Component({
  selector: 'app-user-properties-account',
  templateUrl: './user-properties-account.component.html',
  styleUrls: ['./user-properties-account.component.scss'],
})
export class UserPropertiesAccountComponent implements AfterViewInit {
  UserAccountControlFlag = UserAccountControlFlag;
  domains: DropdownOption[] = [];
  uacBitSet?: BitSet;
  upnDomain?: DropdownOption;
  accessor: LdapAttributes = {};

  get userShouldChangePassword(): boolean {
    return this.accessor?.['pwdLastSet']?.[0] === '0';
  }
  set userShouldChangePassword(shouldChange: boolean) {
    if (shouldChange) {
      if (!!this.accessor?.['pwdLastSet']?.[0]) {
        this.accessor['pwdLastSet'][0] = '0';
      } else {
        this.accessor['pwdLastSet'] = ['0'];
      }
      this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 1);
      this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
      return;
    }
    this.accessor['pwdLastSet'] = [Date.now().toString()];
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 0);
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

    this._accountExpires = !!this.accessor?.['accountExpires']?.[0];
    this.cdr.detectChanges();

    this.nodeLoader
      .get()
      .pipe(take(1))
      .subscribe((domains) => {
        this.domains = domains.map(
          (x) =>
            new DropdownOption({
              title: x.name,
              value: x.id,
            }),
        );
        this.upnDomain = this.domains?.[0]?.value;
      });
  }

  @ViewChild('editLogonTime') editLogonTime!: ModalInjectDirective;
  showLogonTimeEditor() {
    this.editLogonTime
      .open({ width: '732px' }, { logonHours: this.accessor!.logonHours })
      .pipe(take(1))
      .subscribe((result: string | null) => {
        if (!this.accessor || !result) return;

        this.accessor.logonHours = [result];
      });
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

  _expireDate?: number;
  _accountExpires = false;
  set accountExpires(value: boolean) {
    this._accountExpires = value;
    this.cdr.detectChanges();
  }
  get accountExpires(): boolean {
    return this._accountExpires;
  }
}
