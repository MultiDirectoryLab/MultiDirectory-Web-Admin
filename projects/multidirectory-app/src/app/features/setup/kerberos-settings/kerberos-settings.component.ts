import { AfterViewInit, Component, computed, inject, Input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordGenerator } from '@core/setup/password-generator';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/api/setup/setup-request';
import { DownloadService } from '@services/download.service';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { ButtonComponent, MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-kerberos-settings',
  templateUrl: './kerberos-settings.component.html',
  styleUrls: ['./kerberos-settings.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    PasswordValidatorDirective,
    FormsModule,
    PasswordConditionsComponent,
    ButtonComponent,
  ],
})
export class KerberosSettingsComponent implements AfterViewInit {
  @Input() setupRequest!: SetupRequest;

  private form = viewChild.required<MdFormComponent>('form');

  protected passwordPolicy = new PasswordPolicy();
  protected stashPasswordPolicy = new PasswordPolicy({
    minLength: 20,
    maxLength: 32,
    minLowercaseLettersCount: 1,
    minUppercaseLettersCount: 1,
    minDigitsCount: 1,
    minSpecialSymbolsCount: 1,
  });
  protected krbPassword = signal('');
  protected stashPassword = signal('');
  protected showPasswordRequirements = signal<boolean>(false);
  protected passwordRequirementsLabel = computed(() =>
    this.showPasswordRequirements()
      ? translate('user-create.password-settings.hide-password-requirements')
      : translate('user-create.password-settings.show-password-requirements'),
  );
  private unsubscribe = new Subject<void>();

  private setupRequestValidatorService = inject(SetupRequestValidatorService);
  private download = inject(DownloadService);

  ngAfterViewInit(): void {
    const form = this.form();

    if (form) {
      this.updatePasswordsInSignals();
      this.setupRequestValidatorService.stepValid(form.valid);
      this.setupRequestValidatorService.invalidateRx.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.form().validate();
      });

      form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
        this.setupRequestValidatorService.stepValid(valid);
      });
    }
  }

  protected togglePasswordRequirements(): void {
    this.showPasswordRequirements.update((prev) => !prev);
  }

  protected checkModel() {
    this.form().validate();
  }

  protected generatePasswords() {
    const krbPassword = PasswordGenerator.generatePassword(this.passwordPolicy);
    const stashPassword = PasswordGenerator.generatePassword(this.stashPasswordPolicy);

    this.setupRequest.krbadmin_password = krbPassword;
    this.setupRequest.krbadmin_password_repeat = krbPassword;
    this.setupRequest.stash_password = stashPassword;
    this.setupRequest.stash_password_repeat = stashPassword;

    this.krbPassword.set(krbPassword);
    this.stashPassword.set(stashPassword);

    this.checkModel();
  }

  protected downloadPasswords() {
    this.download.downloadDict(
      {
        'KrbAdmin Password': this.setupRequest.krbadmin_password,
        'Stash Password': this.setupRequest.stash_password,
      },
      'md passwords.txt',
    );
  }

  private updatePasswordsInSignals() {
    this.krbPassword.set(this.setupRequest.krbadmin_password);
    this.stashPassword.set(this.setupRequest.stash_password);
  }
}
