import { Component, computed, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordGenerator } from '@core/setup/password-generator';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/api/setup/setup-request';
import { AppSettingsService } from '@services/app-settings.service';
import { DownloadService } from '@services/download.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { SetupService } from '@services/setup.service';
import { ButtonComponent, MdFormComponent, ModalInjectDirective, TextboxComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject } from 'rxjs';

@Component({
  selector: 'app-setup-kerberos-dialog',
  templateUrl: './setup-kerberos.component.html',
  styleUrls: ['./setup-kerberos.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    PasswordValidatorDirective,
    PasswordConditionsComponent,
    ButtonComponent,
  ],
})
export class SetupKerberosDialogComponent implements OnDestroy {
  readonly form = viewChild.required<MdFormComponent>('form');

  protected showPasswordRequirements = signal<boolean>(false);
  protected passwordRequirementsLabel = computed(() =>
    this.showPasswordRequirements()
      ? translate('user-create.password-settings.hide-password-requirements')
      : translate('user-create.password-settings.show-password-requirements'),
  );
  protected passwordPolicy = new PasswordPolicy();
  protected stashPasswordPolicy = new PasswordPolicy({
    minLength: 20,
    maxLength: 32,
    minLowercaseLettersCount: 1,
    minUppercaseLettersCount: 1,
    minDigitsCount: 1,
    minSpecialSymbolsCount: 1,
  });
  protected setupRequest = new SetupRequest();
  protected krbPassword = signal('');
  protected stashPassword = signal('');

  private unsubscribe = new Subject<void>();

  private modalInjector = inject(ModalInjectDirective);
  private toastr = inject(ToastrService);
  private app = inject(AppSettingsService);
  private download = inject(DownloadService);
  private setup = inject(SetupService);
  private api = inject(MultidirectoryApiService);

  ngOnInit() {
    this.loadPasswordPolicy();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  protected togglePasswordRequirements(): void {
    this.showPasswordRequirements.update((prev) => !prev);
  }

  protected checkModel() {
    this.form().validate();
  }

  protected onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.setupRequest.mail = this.app.user.mail;
    const form = this.form();

    if (!form.valid) {
      form.validate();
      return;
    }

    this.modalInjector.showSpinner();
    this.setup
      .kerberosSetup(this.setupRequest)
      .pipe(
        catchError((err) => {
          this.modalInjector.hideSpinner();
          throw err;
        }),
      )
      .subscribe(() => {
        this.toastr.success(translate('setup.kerberos-setup-complete'));
        this.modalInjector.hideSpinner();
        window.location.reload();
      });
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

  protected onClose() {
    this.modalInjector.close(null);
  }

  private loadPasswordPolicy() {
    this.api.getDefaultPasswordPolicy().subscribe((policy) => (this.passwordPolicy = policy));
  }
}
