import { AfterViewInit, Component, inject, Input, OnDestroy, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { UserCreateService } from '@services/user-create.service';
import {
  CheckboxComponent,
  MdFormComponent,
  PopupContainerDirective,
  PopupSuggestComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-create-password-settings',
  styleUrls: ['./password-settings.component.scss'],
  templateUrl: './password-settings.component.html',
  imports: [
    TranslocoPipe,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    PasswordMatchValidatorDirective,
    PasswordValidatorDirective,
    PopupContainerDirective,
    PopupSuggestComponent,
    PasswordConditionsComponent,
    CheckboxComponent,
    MdFormComponent,
  ],
})
export class UserCreatePasswordSettingsComponent implements AfterViewInit, OnDestroy {
  setup = inject(UserCreateService);

  readonly form = viewChild.required<MdFormComponent>('form');
  unsubscribe = new Subject<void>();

  private _setupRequest!: UserCreateRequest;

  get setupRequest(): UserCreateRequest {
    return this._setupRequest;
  }

  @Input() set setupRequest(request: UserCreateRequest) {
    this._setupRequest = request;
    this.form()?.inputs.forEach((x) => x.reset());
  }

  get passwordNeverExpires(): boolean {
    return (
      (Number(this.setupRequest.uacBitSet?.toString(10)) &
        UserAccountControlFlag.DONT_EXPIRE_PASSWORD) >
      0
    );
  }

  set passwordNeverExpires(value: boolean) {
    this.setupRequest.uacBitSet?.set(
      Math.log2(UserAccountControlFlag.DONT_EXPIRE_PASSWORD),
      value ? 1 : 0,
    );
  }

  get accountDisabled(): boolean {
    return (
      (Number(this.setupRequest.uacBitSet?.toString(10)) & UserAccountControlFlag.ACCOUNTDISABLE) >
      0
    );
  }

  set accountDisabled(value: boolean) {
    this.setupRequest.uacBitSet?.set(
      Math.log2(UserAccountControlFlag.ACCOUNTDISABLE),
      value ? 1 : 0,
    );
  }

  get userShouldChangePassword(): boolean {
    return (
      (Number(this.setupRequest.uacBitSet?.toString(10)) &
        UserAccountControlFlag.PASSWORD_EXPIRED) >
      0
    );
  }

  set userShouldChangePassword(shouldChange: boolean) {
    if (shouldChange) {
      this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 1);
      return;
    }
    this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 0);
  }

  ngAfterViewInit(): void {
    const form = this.form();
    this.setup.stepValid(form.valid);
    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form().validate();
    });
    form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.setup.stepValid(this.form().valid);
    });

    this.setupRequest.uacBitSet?.set(Math.log2(UserAccountControlFlag.NORMAL_ACCOUNT), 1);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkModel() {
    this.form().validate();
  }
}
