import { AfterViewInit, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { TranslocoPipe } from '@jsverse/transloco';
import BitSet from 'bitset';
import { CheckboxComponent, GroupComponent } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-computer-properties-account',
  templateUrl: './computer-properties-account.component.html',
  styleUrls: ['./computer-properties-account.component.scss'],
  imports: [GroupComponent, TranslocoPipe, CheckboxComponent, FormsModule],
})
export class ComputerPropertiesAccountComponent implements AfterViewInit {
  @Input() accessor: LdapAttributes = {};
  private cdr = inject(ChangeDetectorRef);
  uacBitSet?: BitSet;

  get userShouldChangePassword(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.PASSWORD_EXPIRED) > 0;
  }

  set userShouldChangePassword(shouldChange: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), shouldChange ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  get passwordNeverExpires(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.DONT_EXPIRE_PASSWORD) > 0;
  }

  set passwordNeverExpires(value: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.DONT_EXPIRE_PASSWORD), value ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  get storePasswordReversible(): boolean {
    return (
      (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT) > 0
    );
  }

  set storePasswordReversible(value: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT), value ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  get accountDisabled(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.ACCOUNTDISABLE) > 0;
  }

  set accountDisabled(value: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.ACCOUNTDISABLE), value ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
  }

  _accountExpires = false;

  get accountExpires(): boolean {
    return this._accountExpires;
  }

  set accountExpires(value: boolean) {
    this._accountExpires = value;
    if (!value) {
      this.accessor['accountExpires'] = ['0'];
    } else {
      this.accessor['accountExpires'] = this.accessor['$accountExpires'];
    }
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    const uacBits = this.accessor['userAccountControl']?.[0];
    this.uacBitSet = this.accessor['userAccountControl']
      ? BitSet.fromHexString(Number(uacBits).toString(16))
      : new BitSet();

    this._accountExpires = !!Number(this.accessor['accountExpires']);
    this.cdr.detectChanges();
  }
}
