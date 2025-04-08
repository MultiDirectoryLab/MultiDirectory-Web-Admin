import { AfterViewInit, Component, Input, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { PasswordShouldNotMatchValidatorDirective } from '@core/validators/passwordnotmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/change-password/password-conditions/password-conditions.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { DownloadService } from '@services/download.service';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import {
  ButtonComponent,
  MdFormComponent,
  PopupContainerDirective,
  PopupSuggestComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
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
    PasswordMatchValidatorDirective,
    PasswordShouldNotMatchValidatorDirective,
    PasswordValidatorDirective,
    FormsModule,
    PopupContainerDirective,
    PopupSuggestComponent,
    PasswordConditionsComponent,
    ButtonComponent,
  ],
})
export class KerberosSettingsComponent implements AfterViewInit {
  private setupRequestValidatorService = inject(SetupRequestValidatorService);
  private download = inject(DownloadService);

  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  @ViewChild('passwordInput') passwordInput!: TextboxComponent;
  @ViewChild('repeatPassword') repeatPassword!: TextboxComponent;

  unsubscribe = new Subject<void>();

  ngAfterViewInit(): void {
    if (this.form) {
      this.setupRequestValidatorService.stepValid(this.form.valid);
      this.setupRequestValidatorService.invalidateRx
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.form.validate();
        });

      this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
        this.setupRequestValidatorService.stepValid(valid);
      });
    }
  }

  checkModel() {
    this.form.validate(true);
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
}
