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
import { EMPTY, Subject, catchError, iif, of, switchMap, takeUntil } from 'rxjs';
import { translate } from '@ngneat/transloco';
import { SetupRequest } from '@models/setup/setup-request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { SetupService } from '@services/setup.service';
import { KerberosSetupRequest } from '@models/setup/kerberos-setup-request';
import { LoginService } from '@services/login.service';
import { KerberosTreeSetupRequest } from '@models/setup/kerberos-tree-setup-request';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
  setupRequest = new SetupRequest();
  @ViewChild('modal') modal!: MdModalComponent;
  @ViewChild('stepper') stepper!: StepperComponent;

  stepValid = false;
  unsubscribe = new Subject<boolean>();
  constructor(
    private api: MultidirectoryApiService,
    private setup: SetupService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
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
    this.modal.resizeToContentHeight();
  }

  onSetup() {
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
          this.toastr.error(err.message);
          this.modal.hideSpinner();
          return EMPTY;
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
        catchError((err) => {
          this.toastr.error(err.message);
          this.modal.hideSpinner();
          throw err;
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
}
