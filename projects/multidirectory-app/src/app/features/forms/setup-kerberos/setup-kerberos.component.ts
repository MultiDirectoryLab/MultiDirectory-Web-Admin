import { Component, OnDestroy, ViewChild } from '@angular/core';
import { PasswordGenerator } from '@core/setup/password-generator';
import { translate } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { AppSettingsService } from '@services/app-settings.service';
import { DownloadService } from '@services/download.service';
import { SetupService } from '@services/setup.service';
import { MdFormComponent, ModalInjectDirective, TextboxComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject } from 'rxjs';

@Component({
  selector: 'app-setup-kerberos-dialog',
  templateUrl: './setup-kerberos.component.html',
  styleUrls: ['./setup-kerberos.component.scss'],
})
export class SetupKerberosDialogComponent implements OnDestroy {
  setupRequest = new SetupRequest();
  @ViewChild('form') form!: MdFormComponent;
  @ViewChild('passwordInput') passwordInput!: TextboxComponent;
  @ViewChild('repeatPassword') repeatPassword!: TextboxComponent;

  unsubscribe = new Subject<void>();

  constructor(
    private modalInejctor: ModalInjectDirective,
    private toastr: ToastrService,
    private app: AppSettingsService,
    private download: DownloadService,
    private setup: SetupService,
  ) {}

  checkModel() {
    this.form.validate(true);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.setupRequest.mail = this.app.user.mail;
    if (!this.form.valid) {
      this.form.validate();
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
      .subscribe((x) => {
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
