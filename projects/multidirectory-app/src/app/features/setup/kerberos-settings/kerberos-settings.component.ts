import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { SetupRequest } from '@models/setup/setup-request';
import { DownloadService } from '@services/download.service';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import {
  MdFormComponent,
  MultidirectoryUiKitModule,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';

import { FormsModule } from '@angular/forms';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { PasswordMatchValidatorDirective } from '../../../core/validators/passwordmatch.directive';
import { PasswordShouldNotMatchValidatorDirective } from '../../../core/validators/passwordnotmatch.directive';
import { RequiredWithMessageDirective } from '../../../core/validators/required-with-message.directive';
import { PasswordValidatorDirective } from '../../../core/validators/password-validator.directive';

@Component({
  selector: 'app-kerberos-settings',
  templateUrl: './kerberos-settings.component.html',
  styleUrls: ['./kerberos-settings.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    TranslocoPipe,
    PasswordMatchValidatorDirective,
    PasswordShouldNotMatchValidatorDirective,
    RequiredWithMessageDirective,
    PasswordValidatorDirective,
    FormsModule,
    PasswordConditionsComponent,
  ],
})
export class KerberosSettingsComponent implements AfterViewInit {
  @Input() setupRequest!: SetupRequest;
  @ViewChild('form') form!: MdFormComponent;
  @ViewChild('passwordInput') passwordInput!: TextboxComponent;
  @ViewChild('repeatPassword') repeatPassword!: TextboxComponent;

  unsubscribe = new Subject<void>();

  constructor(
    private setupRequestValidatorService: SetupRequestValidatorService,
    private download: DownloadService,
  ) {}

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
