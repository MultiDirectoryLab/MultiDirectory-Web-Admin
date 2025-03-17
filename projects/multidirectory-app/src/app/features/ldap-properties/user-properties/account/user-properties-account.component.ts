import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import BitSet from 'bitset';
import { DatepickerComponent, DropdownOption, ModalInjectDirective } from 'multidirectory-ui-kit';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { take, tap } from 'rxjs';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import moment from 'moment';

@Component({
  selector: 'app-user-properties-account',
  templateUrl: './user-properties-account.component.html',
  styleUrls: ['./user-properties-account.component.scss'],
})
export class UserPropertiesAccountComponent implements AfterViewInit {
  @ViewChild('datePicker') datePicker!: DatepickerComponent;
  UserAccountControlFlag = UserAccountControlFlag;
  domains: DropdownOption[] = [];
  uacBitSet?: BitSet;
  upnDomain?: DropdownOption;
  accessor: LdapAttributes = {};

  get userShouldChangePassword(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.PASSWORD_EXPIRED) > 0
      ? true
      : false;
  }
  set userShouldChangePassword(shouldChange: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), shouldChange ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
    this.setPwdLastSetTime(shouldChange);
  }

  fileTimeToDate(filetime: number): moment.Moment {
    return moment(new Date(filetime / 10000 - 11644473600000));
  }

  filetimeFromDate(date: moment.Moment): number {
    return date.date() * 1e4 + 116444736e9;
  }

  unixTimeToFileTime(unixTime: number) {
    // Windows FileTime starts at January 1, 1601, while Unix epoch starts at January 1, 1970.
    const epochDifference = 11644473600; // seconds between 1601-01-01 and 1970-01-01
    const fileTimePerSecond = 10000000; // 1 second = 10 million FileTime units

    // Add the difference in seconds and convert to FileTime units
    const windowsFileTime = (unixTime + epochDifference) * fileTimePerSecond;

    // Convert to BigInt for better precision, since FileTime can exceed regular number limits
    return BigInt(windowsFileTime);
  }

  constructor(
    public modalControl: ModalInjectDirective,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.accessor = this.modalControl.contentOptions.accessor;
    const uacBits = this.accessor['userAccountControl']?.[0];
    this.uacBitSet = !!this.accessor['userAccountControl']
      ? BitSet.fromHexString(Number(uacBits).toString(16))
      : new BitSet();

    this._accountExpires = !!Number(this.accessor['accountExpires']);
    this.cdr.detectChanges();

    // this.nodeLoader
    //   .get()
    //   .pipe(take(1))
    //   .subscribe((domains) => {
    //     this.domains = domains.map(
    //       (x) =>
    //         new DropdownOption({
    //           title: x.name,
    //           value: x.id,
    //         }),
    //     );
    //     this.upnDomain = this.domains?.[0]?.value;
    //   });
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

  _accountExpires = false;
  set accountExpires(value: boolean) {
    this._accountExpires = value;
    if (!value) {
      this.accessor['accountExpires'] = ['0'];
      this.datePicker.clearDate();
    } else {
      this.accessor['accountExpires'] = this.accessor['$accountExpires'];
    }
    this.cdr.detectChanges();
  }
  get accountExpires(): boolean {
    return this._accountExpires;
  }

  setPwdLastSetTime(shouldChange: boolean) {
    if (shouldChange) {
      this.accessor['pwdLastSet'] = ['0'];
      return;
    } else {
      this.accessor['pwdLastSet'] = [this.unixTimeToFileTime(moment.now() / 1000).toString()];
    }
  }
}
