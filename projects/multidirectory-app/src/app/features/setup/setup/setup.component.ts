import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { PasswordGenerator } from '@core/setup/password-generator';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { AppSettingsService } from '@services/app-settings.service';
import { DownloadService } from '@services/download.service';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { SetupService } from '@services/setup.service';
import {
  MdModalComponent,
  MultidirectoryUiKitModule,
  StepperComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DomainSettingsComponent } from '@features/setup/domain-setttings/domain-settings.component';
import { AdminSettingsComponent } from '@features/setup/admin-settings/admin-settings.component';
import { AdminSettingsSecondComponent } from '@features/setup/admin-settings-second/admin-settings-second.component';
import { DnsSetupSettingsComponent } from '@features/setup/dns-setup-settings/dns-setup-settings.component';
import { KerberosSettingsComponent } from '@features/setup/kerberos-settings/kerberos-settings.component';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    FaIconComponent,
    TranslocoPipe,
    DomainSettingsComponent,
    AdminSettingsComponent,
    AdminSettingsSecondComponent,
    DnsSetupSettingsComponent,
    KerberosSettingsComponent,
  ],
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modal!: MdModalComponent;
  @ViewChild('stepper') stepper!: StepperComponent;
  setupRequest = new SetupRequest();
  stepValid = false;
  faLanguage = faLanguage;
  private unsubscribe = new Subject<boolean>();

  constructor(
    private app: AppSettingsService,
    private setupRequestValidatorService: SetupRequestValidatorService,
    private setup: SetupService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private download: DownloadService,
  ) {}

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

  onInitialSetup() {
    this.modal.showSpinner();
    return this.setup.initialSetup(this.setupRequest).pipe(
      catchError((err) => {
        this.modal.hideSpinner();
        this.toastr.error(translate('setup.setup-failed'));
        return of(null);
      }),
      switchMap((res) => {
        this.modal.hideSpinner();
        this.toastr.success(translate('setup.setup-complete'));
        return this.setupRequest.generateKdcPasswords && this.setupRequest.setupKdc
          ? this.onKerberosSetup()
          : of(null);
      }),
    );
  }

  onDnsSetup() {
    this.modal.showSpinner();
    return this.setup.dnsSetup(this.setupRequest).pipe(
      catchError((err) => {
        this.modal.hideSpinner();
        this.toastr.error(translate('setup.dns-setup-failed'));
        return of(null);
      }),
      switchMap((res) => {
        this.modal.hideSpinner();
        this.toastr.success(translate('setup.dns-setup-complete'));
        return of(null);
      }),
    );
  }

  onKerberosSetup() {
    if (this.setupRequest.setupKdc && this.setupRequest.generateKdcPasswords) {
      this.downloadPasswords();
    }

    this.modal.showSpinner();
    return this.setup.kerberosSetup(this.setupRequest).pipe(
      catchError((err) => {
        this.modal.hideSpinner();
        this.toastr.error(translate('setup.kerberos-setup-failed'));
        return of(null);
      }),
      switchMap((res) => {
        this.modal.hideSpinner();
        this.toastr.success(translate('setup.kerberos-setup-complete'));
        return of(null);
      }),
    );
  }

  onFinish() {
    this.router.navigate(['/']);
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
