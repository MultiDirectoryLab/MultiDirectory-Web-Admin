import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordGenerator } from '@core/setup/password-generator';
import { KerberosSetupRequest } from '@models/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/setup/kerberos-tree-setup-request';
import { SetupRequest } from '@models/setup/setup-request';
import { translate } from '@ngneat/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MdFormComponent, ModalInjectDirective, TextboxComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, of, Subject, switchMap } from 'rxjs';

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
    private api: MultidirectoryApiService,
    private toastr: ToastrService,
    private app: AppSettingsService,
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
    this.api
      .kerberosTreeSetup(
        new KerberosTreeSetupRequest({}).flll_from_setup_request(this.setupRequest),
      )
      .pipe(
        catchError((err) => {
          if (err.status == 409 || err.status == 403) {
            return of(true);
          }
          this.toastr.error(err.message);
          this.modalInejctor.hideSpinner();
          return EMPTY;
        }),
        switchMap((value) => {
          return this.api.kerberosSetup(
            new KerberosSetupRequest({}).flll_from_setup_request(this.setupRequest),
          );
        }),
        catchError((err) => {
          this.toastr.error(err.message);
          this.modalInejctor.hideSpinner();
          throw err;
        }),
      )
      .subscribe((x) => {
        this.toastr.success(translate('setup.setup-complete'));
        window.location.reload();
        this.modalInejctor.close(null);
      });
  }

  generatePasswords() {
    this.setupRequest.generateKdcPasswords = true;
    this.setupRequest.krbadmin_password = this.setupRequest.krbadmin_password_repeat =
      PasswordGenerator.generatePassword();
    this.setupRequest.stash_password = this.setupRequest.stash_password_repeat =
      PasswordGenerator.generatePassword();
  }

  downloadPasswords() {
    // this.downloadData.downloadDict({
    //   "KrbAdmin Password": this.setupRequest.krbadmin_password,
    //   "Stash Password": this.setupRequest.stash_password
    // }, "md passwords.txt");
  }

  onClose() {
    this.modalInejctor.close(null);
  }
}
