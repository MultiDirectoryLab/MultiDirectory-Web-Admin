import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { SetupRequest } from '@models/setup/setup-request';
import { DownloadService } from '@services/download.service';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { MdFormComponent, StepperComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-kerberos-settings',
  templateUrl: './kerberos-settings.component.html',
  styleUrls: ['./kerberos-settings.component.scss'],
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
