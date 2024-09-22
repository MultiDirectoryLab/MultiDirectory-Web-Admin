import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MdModalComponent, StepperComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import {
  EMPTY,
  Subject,
  catchError,
  delay,
  expand,
  generate,
  iif,
  of,
  retry,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs';
import { translate } from '@jsverse/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { SetupService } from '@services/setup.service';
import { KerberosSetupRequest } from '@models/setup/kerberos-setup-request';
import { LoginService } from '@services/login.service';
import { KerberosTreeSetupRequest } from '@models/setup/kerberos-tree-setup-request';
import { PasswordGenerator } from '@core/setup/password-generator';
import { DownloadService } from '@services/download.service';
import { AppSettingsService } from '@services/app-settings.service';
import { AppNavigationService } from '@services/app-navigation.service';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';

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
    private api: MultidirectoryApiService,
    private app: AppSettingsService,
    private setup: SetupService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private download: DownloadService,
  ) {}

  ngOnInit(): void {
    this.setupRequest.domain = window.location.hostname;
    this.setup.onStepValid.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
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
    this.api
      .setup(this.setupRequest)
      .pipe(
        switchMap((login) =>
          this.loginService.login(
            this.setupRequest.user_principal_name,
            this.setupRequest.password,
          ),
        ),
        switchMap((value) => {
          return iif(
            () => this.setupRequest.setupKdc,
            this.api.kerberosTreeSetup(
              new KerberosTreeSetupRequest({}).flll_from_setup_request(this.setupRequest),
            ),
            of(value),
          );
        }),
        catchError((err) => {
          console.log(err);
          this.toastr.error(err);
          return of(true);
        }),
        switchMap((value) => {
          return iif(
            () => this.setupRequest.setupKdc,
            this.api.kerberosSetup(
              new KerberosSetupRequest({}).flll_from_setup_request(this.setupRequest),
            ),
            of(value),
          );
        }),
        switchMap(() => {
          // Polling getKerberosStatus every 1 second until status === 1
          return this.api.getKerberosStatus().pipe(
            expand(
              () => this.api.getKerberosStatus().pipe(delay(1000)), // Repeat the call every 1 second
            ),
            takeWhile((status) => status !== KerberosStatuses.READY, true), // Continue until status === 1
          );
        }),
        catchError((err) => {
          this.toastr.error(err.message);
          this.modal.hideSpinner();
          return of(true);
        }),
      )
      .subscribe((res) => {
        this.modal.hideSpinner();
        this.toastr.success(translate('setup.setup-complete'));
        this.router.navigate(['/']);
      });
  }

  resize() {
    this.modal.resizeToContentHeight();
    this.cdr.detectChanges();
  }

  showNextStep() {
    if (!this.stepValid) {
      this.setup.invalidate();
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

  changeLanguage() {
    this.app.language = this.app.language == 'en-US' ? 'ru-RU' : 'en-US';
  }
}
