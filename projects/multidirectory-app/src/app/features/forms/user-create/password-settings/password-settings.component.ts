import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { UserCreateService } from '@services/user-create.service';
import { Subject, takeUntil } from 'rxjs';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { PasswordMatchValidatorDirective } from '../../../../core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '../../../../core/validators/required-with-message.directive';
import { PasswordValidatorDirective } from '../../../../core/validators/password-validator.directive';

@Component({
  selector: 'app-user-create-password-settings',
  templateUrl: './password-settings.component.html',
  styleUrls: ['./password-settings.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    TranslocoPipe,
    FormsModule,
    PasswordMatchValidatorDirective,
    RequiredWithMessageDirective,
    PasswordValidatorDirective,
    PasswordConditionsComponent,
  ],
})
export class UserCreatePasswordSettingsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('form') form!: MdFormComponent;
  unsubscribe = new Subject<void>();

  constructor(public setup: UserCreateService) {}

  private _setupRequest!: UserCreateRequest;

  get setupRequest(): UserCreateRequest {
    return this._setupRequest;
  }

  @Input() set setupRequest(request: UserCreateRequest) {
    this._setupRequest = request;
    this.form?.inputs.forEach((x) => x.reset());
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
    return (Number(this.setupRequest.uacBitSet?.toString(10)) &
      UserAccountControlFlag.PASSWORD_EXPIRED) >
      0
      ? true
      : false;
  }

  set userShouldChangePassword(shouldChange: boolean) {
    if (shouldChange) {
      this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 1);
      return;
    }
    this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 0);
  }

  ngAfterViewInit(): void {
    this.setup.stepValid(this.form.valid);
    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form.validate();
    });
    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.setup.stepValid(this.form.valid);
    });

    this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.NORMAL_ACCOUNT), 1);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkModel() {
    this.form.validate();
  }
}
