import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import BitSet from 'bitset';
import moment from 'moment';
import {
  ButtonComponent,
  CheckboxComponent,
  DatepickerComponent,
  DropdownComponent,
  DropdownOption,
  GroupComponent,
  RadiobuttonComponent,
  RadioGroupComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { take } from 'rxjs';
import { LogonTimeEditorDialogComponent } from '../../../../components/modals/components/dialogs/logon-time-editor-dialog/logon-time-editor-dialog.component';
import { EntityPropertiesDialogData } from '../../../../components/modals/interfaces/entity-properties-dialog.interface';
import {
  LogonTimeEditorDialogData,
  LogonTimeEditorDialogReturnData,
} from '../../../../components/modals/interfaces/logon-time-editor-dialog.interface';
import { DialogService } from '../../../../components/modals/services/dialog.service';

@Component({
  selector: 'app-user-properties-account',
  templateUrl: './user-properties-account.component.html',
  styleUrls: ['./user-properties-account.component.scss'],
  standalone: true,
  imports: [
    TranslocoPipe,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    DropdownComponent,
    ButtonComponent,
    CheckboxComponent,
    GroupComponent,
    RadioGroupComponent,
    RadiobuttonComponent,
    DatepickerComponent,
  ],
})
export class UserPropertiesAccountComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private dialogService: DialogService = inject(DialogService);
  public dialogData: EntityPropertiesDialogData = inject(DIALOG_DATA);
  readonly datePicker = viewChild.required<DatepickerComponent>('datePicker');
  @Input() accessor!: LdapAttributes;
  UserAccountControlFlag = UserAccountControlFlag;
  domains: DropdownOption[] = [];
  uacBitSet?: BitSet;
  upnDomain?: DropdownOption;

  get userShouldChangePassword(): boolean {
    return (Number(this.uacBitSet?.toString(10)) & UserAccountControlFlag.PASSWORD_EXPIRED) > 0;
  }

  set userShouldChangePassword(shouldChange: boolean) {
    this.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), shouldChange ? 1 : 0);
    this.accessor['userAccountControl'] = [this.uacBitSet?.toString(10)];
    this.setPwdLastSetTime(shouldChange);
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
      this.datePicker().clearDate();
    } else {
      this.accessor['accountExpires'] = this.accessor['$accountExpires'];
    }
    this.cdr.detectChanges();
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

  ngAfterViewInit(): void {
    const uacBits = this.accessor['userAccountControl']?.[0];
    this.uacBitSet = this.accessor['userAccountControl']
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

  // @ViewChild('editLogonTime') editLogonTime!: ModalInjectDirective;
  showLogonTimeEditor() {
    this.dialogService
      .open<
        LogonTimeEditorDialogReturnData,
        LogonTimeEditorDialogData,
        LogonTimeEditorDialogComponent
      >({
        component: LogonTimeEditorDialogComponent,
        dialogConfig: {
          width: '732px',
          data: {
            logonHours: (this.accessor!.logonHours ?? '') as unknown as string,
          },
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (!this.accessor || !result) return;

        this.accessor.logonHours = [result];
      });

    // this.editLogonTime
    //   .open({ width: '732px' }, { logonHours: this.accessor!.logonHours })
    //   .pipe(take(1))
    //   .subscribe((result: string | null) => {
    //     console.log('result', result);
    //     if (!this.accessor || !result) return;
    //
    //     this.accessor.logonHours = [result];
    //   });
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
