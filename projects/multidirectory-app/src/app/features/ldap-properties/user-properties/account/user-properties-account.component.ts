import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import BitSet from 'bitset';
import {
  DatepickerComponent,
  DropdownOption,
  MdModalModule,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { take } from 'rxjs';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { DialogService } from '../../../../components/modals/services/dialog.service';
import { LogonTimeEditorDialogComponent } from '../../../../components/modals/components/dialogs/logon-time-editor-dialog/logon-time-editor-dialog.component';
import {
  LogonTimeEditorDialogData,
  LogonTimeEditorDialogReturnData,
} from '../../../../components/modals/interfaces/logon-time-editor-dialog.interface';
import { EntityPropertiesDialogData } from '../../../../components/modals/interfaces/entity-properties-dialog.interface';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';

@Component({
  selector: 'app-user-properties-account',
  templateUrl: './user-properties-account.component.html',
  styleUrls: ['./user-properties-account.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    FormsModule,
    MdModalModule,
    TranslocoPipe,
    RequiredWithMessageDirective,
  ],
})
export class UserPropertiesAccountComponent implements AfterViewInit {
  public dialogData: EntityPropertiesDialogData = inject(DIALOG_DATA);
  @ViewChild('datePicker') datePicker!: DatepickerComponent;
  @Input() accessor!: LdapAttributes;
  UserAccountControlFlag = UserAccountControlFlag;
  domains: DropdownOption[] = [];
  uacBitSet?: BitSet;
  upnDomain?: DropdownOption;
  private dialogService: DialogService = inject(DialogService);

  constructor(
    private cdr: ChangeDetectorRef,
    private nodeLoader: LdapEntryLoader,
  ) {}

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
      this.datePicker.clearDate();
    } else {
      this.accessor['accountExpires'] = this.accessor['$accountExpires'];
    }
    this.cdr.detectChanges();
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

  ngAfterViewInit(): void {
    const uacBits = this.accessor['userAccountControl']?.[0];
    this.uacBitSet = !!this.accessor['userAccountControl']
      ? BitSet.fromHexString(Number(uacBits).toString(16))
      : new BitSet();

    this._accountExpires = !!Number(this.accessor['accountExpires']);
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
