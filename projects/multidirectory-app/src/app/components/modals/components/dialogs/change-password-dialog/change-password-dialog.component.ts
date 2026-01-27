import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild, ViewChild } from '@angular/core';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { DialogComponent } from '../../core/dialog/dialog.component';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormsModule, NgModel } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordConditionsComponent } from '@features/ldap-browser/components/editors/password-conditions/password-conditions.component';
import { ChangePasswordRequest } from '@models/api/user/change-password-request';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY } from 'rxjs';
import { ChangePasswordDialogData, ChangePasswordDialogReturnData } from '../../../interfaces/change-password-dialog.interface';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    TranslocoPipe,
    PasswordMatchValidatorDirective,
    RequiredWithMessageDirective,
    PasswordValidatorDirective,
    FormsModule,
    PasswordConditionsComponent,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  private dialogData: ChangePasswordDialogData = inject(DIALOG_DATA);
  @ViewChild('form', { static: true }) form!: MdFormComponent;

  private passwordInput = viewChild.required<NgModel>('passwordInput');
  private dialog = viewChild.required<DialogComponent>('dialog');

  protected repeatPassword = '';
  protected un = this.dialogData.un;
  protected me = this.dialogData.me;
  protected password = signal('');
  protected changeRequest = new ChangePasswordRequest({ identity: this.dialogData.identity });
  protected passwordPolicy = new PasswordPolicy();
  protected showPasswordRequirements = signal<boolean>(false);
  protected passwordRequirementsLabel = computed(() =>
    this.showPasswordRequirements()
      ? translate('user-create.password-settings.hide-password-requirements')
      : translate('user-create.password-settings.show-password-requirements'),
  );

  private dialogRef: DialogRef<ChangePasswordDialogReturnData, ChangePasswordDialogComponent> = inject(DialogRef);
  private dialogService: DialogService = inject(DialogService);
  private toastr: ToastrService = inject(ToastrService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);

  ngOnInit() {
    this.loadPasswordPolicy();
  }

  protected togglePasswordRequirements(): void {
    this.showPasswordRequirements.update((prev) => !prev);
  }

  protected close() {
    this.dialogService.close(this.dialogRef);
  }

  protected finish() {
    this.dialog().showSpinner();
    this.api
      .changePassword(this.changeRequest)
      .pipe(
        catchError(() => {
          this.dialogService.close(this.dialogRef);
          return EMPTY;
        }),
      )
      .subscribe((x) => {
        this.toastr.success(translate('change-password.password-successfully-changed'));
        this.dialog().hideSpinner();
        this.dialogService.close(this.dialogRef, x);
      });
  }

  protected checkModel() {
    this.form.validate();
    this.password.set(this.passwordInput().value);
  }

  private loadPasswordPolicy() {
    this.api.getDefaultPasswordPolicy().subscribe((policy) => (this.passwordPolicy = policy));
  }
}
