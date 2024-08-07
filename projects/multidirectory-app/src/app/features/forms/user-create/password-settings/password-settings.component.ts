import { AfterViewInit, Component, Input, OnDestroy, ViewChild, forwardRef } from '@angular/core';
import { MdFormComponent } from 'multidirectory-ui-kit';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { UserCreateService } from '@services/user-create.service';
import { Subject, takeUntil } from 'rxjs';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';

@Component({
  selector: 'app-user-create-password-settings',
  styleUrls: ['./password-settings.component.scss'],
  templateUrl: './password-settings.component.html',
})
export class UserCreatePasswordSettingsComponent implements AfterViewInit, OnDestroy {
  private _setupRequest!: UserCreateRequest;
  @Input() set setupRequest(request: UserCreateRequest) {
    this._setupRequest = request;
    this.form?.inputs.forEach((x) => x.reset());
  }
  get setupRequest(): UserCreateRequest {
    return this._setupRequest;
  }

  @ViewChild('form') form!: MdFormComponent;

  unsubscribe = new Subject<void>();

  constructor(public setup: UserCreateService) {}

  ngAfterViewInit(): void {
    this.setup.stepValid(this.form.valid);
    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form.validate();
    });
    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.setup.stepValid(this.form.valid);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkModel() {
    this.form.validate();
  }

  get passwordNeverExpires(): boolean {
    return (Number(this.setupRequest.uacBitSet?.toString(10)) &
      UserAccountControlFlag.DONT_EXPIRE_PASSWORD) >
      0
      ? true
      : false;
  }
  set passwordNeverExpires(value: boolean) {
    this.setupRequest.uacBitSet?.set(
      Math.log2(UserAccountControlFlag.DONT_EXPIRE_PASSWORD),
      value ? 1 : 0,
    );
  }

  get storePasswordReversible(): boolean {
    return (Number(this.setupRequest.uacBitSet?.toString(10)) &
      UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT) >
      0
      ? true
      : false;
  }
  set storePasswordReversible(value: boolean) {
    this.setupRequest.uacBitSet?.set(
      Math.log2(UserAccountControlFlag.PARTIAL_SECRETS_ACCOUNT),
      value ? 1 : 0,
    );
  }

  get accountDisabled(): boolean {
    return (Number(this.setupRequest.uacBitSet?.toString(10)) &
      UserAccountControlFlag.ACCOUNTDISABLE) >
      0
      ? true
      : false;
  }
  set accountDisabled(value: boolean) {
    this.setupRequest.uacBitSet?.set(
      Math.log2(UserAccountControlFlag.ACCOUNTDISABLE),
      value ? 1 : 0,
    );
  }

  get userShouldChangePassword(): boolean {
    return this.setupRequest.pwdLastSet === '0';
  }
  set userShouldChangePassword(shouldChange: boolean) {
    if (shouldChange) {
      this.setupRequest.pwdLastSet = '0';
      this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 1);
      return;
    }
    this.setupRequest.pwdLastSet = Date.now().toString();
    this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 0);
  }
}
