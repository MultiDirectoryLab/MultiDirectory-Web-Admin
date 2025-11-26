import { AfterViewInit, Component, computed, inject, input, OnDestroy, signal, viewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { UserAccountControlFlag } from '@core/ldap/user-account-control-flags';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { UserCreateRequest } from '@models/api/user-create/user-create.request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { UserCreateService } from '@services/user-create.service';
import { ButtonComponent, CheckboxComponent, MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
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
    CheckboxComponent,
    MdFormComponent,
    ButtonComponent,
    PasswordConditionsComponent,
  ],
})
export class UserCreatePasswordSettingsComponent implements AfterViewInit, OnDestroy {
  setupRequest = input.required<UserCreateRequest>();

  private form = viewChild.required<MdFormComponent>('form');
  private passwordInput = viewChild.required<NgModel>('passwordInput');

  protected showPasswordRequirements = signal<boolean>(false);
  protected passwordPolicy = new PasswordPolicy();
  protected password = signal<string>('');
  protected passwordRequirementsLabel = computed(() =>
    this.showPasswordRequirements()
      ? translate('user-create.password-settings.hide-password-requirements')
      : translate('user-create.password-settings.show-password-requirements'),
  );
  private unsubscribe = new Subject<void>();

  private setup = inject(UserCreateService);
  private api = inject(MultidirectoryApiService);

  get passwordNeverExpires(): boolean {
    return (Number(this.setupRequest().uacBitSet?.toString(10)) & UserAccountControlFlag.DONT_EXPIRE_PASSWORD) > 0;
  }

  set passwordNeverExpires(value: boolean) {
    this.setupRequest().uacBitSet?.set(Math.log2(UserAccountControlFlag.DONT_EXPIRE_PASSWORD), value ? 1 : 0);
  }

  get accountDisabled(): boolean {
    return (Number(this.setupRequest().uacBitSet?.toString(10)) & UserAccountControlFlag.ACCOUNTDISABLE) > 0;
  }

  set accountDisabled(value: boolean) {
    this.setupRequest().uacBitSet?.set(Math.log2(UserAccountControlFlag.ACCOUNTDISABLE), value ? 1 : 0);
  }

  get userShouldChangePassword(): boolean {
    return (Number(this.setupRequest().uacBitSet?.toString(10)) & UserAccountControlFlag.PASSWORD_EXPIRED) > 0;
  }

  set userShouldChangePassword(shouldChange: boolean) {
    if (shouldChange) {
      this.setupRequest().uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 1);
      return;
    }
    this.setupRequest().uacBitSet?.set(Math.log2(UserAccountControlFlag.PASSWORD_EXPIRED), 0);
  }

  get userUnableToChangePassword(): boolean {
    return (Number(this.setupRequest().uacBitSet.toString(10)) & UserAccountControlFlag.PASSWD_CANT_CHANGE) > 0;
  }

  set userUnableToChangePassword(shouldChange: boolean) {
    this.setupRequest().uacBitSet.set(Math.log2(UserAccountControlFlag.PASSWD_CANT_CHANGE), Number(shouldChange));
  }

  ngOnInit() {
    this.loadPasswordPolicy();
  }

  ngAfterViewInit(): void {
    const form = this.form();
    this.setup.stepValid(form.valid);

    this.setup.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.form().validate();
      this.setup.stepValid(form.valid);
    });

    form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.setup.stepValid(form.valid);
    });

    this.setupRequest().uacBitSet?.set(Math.log2(UserAccountControlFlag.NORMAL_ACCOUNT), 1);

    setTimeout(() => this.validateFormWithValues(), 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  protected checkModel() {
    this.form().validate();
    this.password.set(this.passwordInput().value);
  }

  protected togglePasswordRequirements(): void {
    this.showPasswordRequirements.update((prev) => !prev);
  }

  private loadPasswordPolicy() {
    this.api.getDefaultPasswordPolicy().subscribe((policy) => (this.passwordPolicy = policy));
  }

  private validateFormWithValues(): void {
    const form = this.form();
    let hasValue = false;

    form.inputs.forEach((input) => {
      if (input.control) {
        hasValue = !!input.control.value && input.control.value !== '' && typeof input.control.value !== 'boolean';

        if (hasValue) {
          input.control.markAsTouched({ onlySelf: true });
          input.control.markAsDirty({ onlySelf: true });
          input.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
      }
    });

    if (hasValue) {
      form.validate();
      this.setup.stepValid(form.valid);
    }
  }
}
