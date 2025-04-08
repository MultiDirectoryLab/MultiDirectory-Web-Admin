import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { PasswordGenerator } from '@core/setup/password-generator';
import { AdminSettingsSecondComponent } from '@features/setup/admin-settings-second/admin-settings-second.component';
import { AdminSettingsComponent } from '@features/setup/admin-settings/admin-settings.component';
import { DnsSetupSettingsComponent } from '@features/setup/dns-setup-settings/dns-setup-settings.component';
import { DomainSettingsComponent } from '@features/setup/domain-setttings/domain-settings.component';
import { KerberosSettingsComponent } from '@features/setup/kerberos-settings/kerberos-settings.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { AppSettingsService } from '@services/app-settings.service';
import { DownloadService } from '@services/download.service';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { SetupService } from '@services/setup.service';
import {
  ButtonComponent,
  DropdownContainerDirective,
  DropdownMenuComponent,
  MdFormComponent,
  MdModalComponent,
  PlaneButtonComponent,
  StepDirective,
  StepperComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  imports: [
    MdFormComponent,
    MdModalComponent,
    TranslocoPipe,
    PlaneButtonComponent,
    FaIconComponent,
    DropdownContainerDirective,
    DropdownMenuComponent,
    StepperComponent,
    DomainSettingsComponent,
    StepDirective,
    DnsSetupSettingsComponent,
    KerberosSettingsComponent,
    AdminSettingsComponent,
    AdminSettingsSecondComponent,
    ButtonComponent,
  ],
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
  private app = inject(AppSettingsService);
  private setupRequestValidatorService = inject(SetupRequestValidatorService);
  private setup = inject(SetupService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private download = inject(DownloadService);

  @ViewChild('modal') modal!: MdModalComponent;
  @ViewChild('stepper') stepper!: StepperComponent;
  setupRequest = new SetupRequest();
  stepValid = false;
  faLanguage = faLanguage;
  private unsubscribe = new Subject<boolean>();

  ngOnInit(): void {
    this.setupRequest.domain = window.location.hostname;
    this.setupRequest.setupDnsRequest.domain = window.location.hostname;
    this.setupRequest.setupDnsRequest.zone_name = window.location.hostname;
    this.setupRequestValidatorService.onStepValid
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((valid) => {
        this.stepValid = valid;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onNext(templateRef: any) {
    if (this.stepper.currentIndex == 1 && this.setupRequest.generateKdcPasswords) {
      this.setupRequest.krbadmin_password = this.setupRequest.krbadmin_password_repeat =
        PasswordGenerator.generatePassword();
      this.setupRequest.stash_password = this.setupRequest.stash_password_repeat =
        PasswordGenerator.generatePassword();
    }
    this.modal.resizeToContentHeight();
  }

  onSetup() {
    if (this.setupRequest.setupKdc && this.setupRequest.generateKdcPasswords) {
      this.downloadPasswords();
    }

    this.modal.showSpinner();
    this.setup
      .setup(this.setupRequest)
      .pipe(
        catchError((err) => {
          this.modal.hideSpinner();
          this.router.navigate(['/']);
          throw err;
        }),
      )
      .subscribe((res) => {
        this.modal.hideSpinner();
        this.toastr.success(translate('setup.setup-complete'));
        this.router.navigate(['/']);
      });
  }

  showNextStep() {
    if (!this.stepValid) {
      this.setupRequestValidatorService.invalidate();
      this.toastr.error(translate('please-check-errors'));
      return;
    }
    this.stepper.next();
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

  changeLanguage(lang = '') {
    if (!lang) {
      this.app.language = this.app.language == 'en-US' ? 'ru-RU' : 'en-US';
    } else if (lang == 'ru') {
      this.app.language = 'ru-RU';
    } else if (lang == 'en') {
      this.app.language = 'en-US';
    }
  }
}
