import { Component, inject, OnDestroy, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordGenerator } from '@core/setup/password-generator';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { PasswordShouldNotMatchValidatorDirective } from '@core/validators/passwordnotmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/api/setup/setup-request';
import { AppSettingsService } from '@services/app-settings.service';
import { DownloadService } from '@services/download.service';
import { SetupService } from '@services/setup.service';
import {
  ButtonComponent,
  MdFormComponent,
  ModalInjectDirective,
  PopupContainerDirective,
  PopupSuggestComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
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
    PasswordMatchValidatorDirective,
    PasswordShouldNotMatchValidatorDirective,
    PasswordValidatorDirective,
    PopupContainerDirective,
    PopupSuggestComponent,
    PasswordConditionsComponent,
    ButtonComponent,
  ],
})
export class SetupKerberosDialogComponent implements OnDestroy {
  private modalInejctor = inject(ModalInjectDirective);
  private toastr = inject(ToastrService);
  private app = inject(AppSettingsService);
  private download = inject(DownloadService);
  private setup = inject(SetupService);

  setupRequest = new SetupRequest();
  readonly form = viewChild.required<MdFormComponent>('form');
  unsubscribe = new Subject<void>();

  checkModel() {
    this.form().validate(true);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.setupRequest.mail = this.app.user.mail;
    const form = this.form();
    if (!form.valid) {
      form.validate();
      return;
    }
    this.modalInejctor.showSpinner();
    this.setup
      .kerberosSetup(this.setupRequest)
      .pipe(
        catchError((err) => {
          this.modalInejctor.hideSpinner();
          throw err;
        }),
      )
      .subscribe(() => {
        this.toastr.success(translate('setup.kerberos-setup-complete'));
        this.modalInejctor.hideSpinner();
        window.location.reload();
      });
  }

  generatePasswords() {
    this.setupRequest.generateKdcPasswords = true;
    this.setupRequest.krbadmin_password = this.setupRequest.krbadmin_password_repeat =
      PasswordGenerator.generatePassword();
    this.setupRequest.stash_password = this.setupRequest.stash_password_repeat =
      PasswordGenerator.generatePassword();
    this.checkModel();
  }

  downloadPasswords() {
    this.download.downloadDict(
      {
        'KrbAdmin Password': this.setupRequest.krbadmin_password,
        'Stash Password': this.setupRequest.stash_password,
      },
      'md passwords.txt',
    );
  }

  onClose() {
    this.modalInejctor.close(null);
  }
}
