import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';

import { FormsModule } from '@angular/forms';
import { catchError, EMPTY, Subject } from 'rxjs';
import { ChangePasswordRequest } from '@models/user/change-password-request';
import { ToastrService } from 'ngx-toastr';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangePasswordDialogData,
  ChangePasswordDialogReturnData,
} from '../../../interfaces/change-password-dialog.interface';
import { PasswordMatchValidatorDirective } from '../../../../../core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '../../../../../core/validators/required-with-message.directive';
import { PasswordValidatorDirective } from '../../../../../core/validators/password-validator.directive';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    PasswordConditionsComponent,
    TranslocoPipe,
    PasswordMatchValidatorDirective,
    RequiredWithMessageDirective,
    PasswordValidatorDirective,
    FormsModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  @ViewChild('form', { static: true }) form!: MdFormComponent;

  public unsubscribe = new Subject<boolean>();
  public formValid = false;
  public repeatPassword = '';

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<ChangePasswordDialogReturnData, ChangePasswordDialogComponent> =
    inject(DialogRef);
  private dialogData: ChangePasswordDialogData = inject(DIALOG_DATA);
  public changeRequest = new ChangePasswordRequest({ identity: this.dialogData.identity });
  public un = this.dialogData.un;
  private toastr: ToastrService = inject(ToastrService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);

  public close() {
    this.dialogService.close(this.dialogRef);
  }

  public finish() {
    this.api
      .changePassword(this.changeRequest)
      .pipe(
        catchError(() => {
          this.toastr.error(translate('change-password.unable-change-password'));
          this.dialogService.close(this.dialogRef);

          return EMPTY;
        }),
      )
      .subscribe((x) => {
        // this.modalControl.modal?.hideSpinner();
        this.toastr.success(translate('change-password.password-successfully-changed'));

        this.dialogService.close(this.dialogRef, x);
      });
  }

  public checkModel() {
    this.form.validate();
  }
}
