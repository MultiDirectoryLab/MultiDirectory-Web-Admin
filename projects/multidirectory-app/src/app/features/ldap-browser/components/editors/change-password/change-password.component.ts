import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/change-password/password-conditions/password-conditions.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ChangePasswordRequest } from '@models/user/change-password-request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  MdFormComponent,
  ModalInjectDirective,
  PopupContainerDirective,
  PopupSuggestComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [
    MdFormComponent,
    TranslocoPipe,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    PasswordMatchValidatorDirective,
    PasswordValidatorDirective,
    PopupContainerDirective,
    PopupSuggestComponent,
    PasswordConditionsComponent,
    ButtonComponent,
  ],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  unsubscribe = new Subject<boolean>();
  formValid = false;
  changeRequest = new ChangePasswordRequest();
  repeatPassword = '';
  un = '';

  constructor(
    private toastr: ToastrService,
    private api: MultidirectoryApiService,
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
  ) {}

  ngOnInit(): void {
    if (!!this.modalControl?.contentOptions?.identity) {
      this.changeRequest.identity = this.modalControl.contentOptions.identity;
      this.un = this.modalControl.contentOptions.un;
    }

    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });
  }

  close() {
    this.modalControl.close(undefined);
  }

  finish() {
    this.modalControl.modal?.showSpinner();
    this.api
      .changePassword(this.changeRequest)
      .pipe(
        catchError((err) => {
          this.toastr.error(translate('change-password.unable-change-password'));
          this.modalControl.close(false);
          return EMPTY;
        }),
      )
      .subscribe((x) => {
        this.modalControl.modal?.hideSpinner();
        this.toastr.success(translate('change-password.password-successfully-changed'));
        this.modalControl.close(x);
      });
  }

  checkModel() {
    this.form.validate();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
}
