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
import { translate } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { AppSettingsService } from '@services/app-settings.service';
import { DownloadService } from '@services/download.service';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { SetupService } from '@services/setup.service';
import { MdModalComponent, StepperComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, delay, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modal!: MdModalComponent;
  @ViewChild('stepper') stepper!: StepperComponent;

  private unsubscribe = new Subject<boolean>();
  setupRequest = new SetupRequest();
  stepValid = false;
  faLanguage = faLanguage;

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
