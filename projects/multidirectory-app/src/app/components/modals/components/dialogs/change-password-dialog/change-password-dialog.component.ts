import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { ContextMenuService } from '../../../services/context-menu.service';
import { PasswordSuggestContextMenuComponent } from '../../context-menus/password-suggest-context-menu/password-suggest-context-menu.component';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';

import { FormsModule, NgModel } from '@angular/forms';
import { catchError, EMPTY, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangePasswordDialogData,
  ChangePasswordDialogReturnData,
} from '../../../interfaces/change-password-dialog.interface';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { ChangePasswordRequest } from '@models/api/user/change-password-request';
import { AppSettingsService } from '@services/app-settings.service';

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
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  @ViewChild('form', { static: true }) form!: MdFormComponent;

  unsubscribe = new Subject<boolean>();
  repeatPassword = '';

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<ChangePasswordDialogReturnData, ChangePasswordDialogComponent> =
    inject(DialogRef);
  private dialogData: ChangePasswordDialogData = inject(DIALOG_DATA);
  private dialog = viewChild.required<DialogComponent>('dialog');
  changeRequest = new ChangePasswordRequest({ identity: this.dialogData.identity });
  un = this.dialogData.un;
  private toastr: ToastrService = inject(ToastrService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private contextMenuService = inject(ContextMenuService);
  private appSettings = inject(AppSettingsService);
  private suggestDialogRef: DialogRef<unknown, PasswordSuggestContextMenuComponent> | null = null;
  private passwordInput = viewChild.required<NgModel>('passwordInput');
  private password = signal('');

  close() {
    this.dialogService.close(this.dialogRef);
  }

  finish() {
    this.dialog().showSpinner();
    this.api
      .changePassword(this.changeRequest)
      .pipe(
        catchError(() => {
          this.toastr.error(translate('change-password.unable-change-password'));
          this.dialogService.close(this.dialogRef);
          this.dialog().hideSpinner();
          return EMPTY;
        }),
      )
      .subscribe((x) => {
        // this.modalControl.modal?.hideSpinner();
        this.toastr.success(translate('change-password.password-successfully-changed'));
        this.dialog().hideSpinner();
        this.dialogService.close(this.dialogRef, x);
      });
  }

  checkModel() {
    this.form.validate();
    this.password.set(this.passwordInput().value);
    if (this.passwordInput().valid) {
      this.closeSuggest();
    }
  }

  openSuggest(event: FocusEvent): void {
    const target = ((event as unknown as Event).target as HTMLElement).parentElement as HTMLElement;
    const targetRect = target.getBoundingClientRect();

    this.suggestDialogRef = this.contextMenuService.open({
      contextMenuConfig: {
        hasBackdrop: false,
        data: { password: this.password },
      },
      component: PasswordSuggestContextMenuComponent,
      y: targetRect.y,
      x: targetRect.right + 8,
    });
  }

  closeSuggest(): void {
    if (this.suggestDialogRef) {
      this.suggestDialogRef.close();
    }
  }

  protected get me(): boolean {
    return this.appSettings.user?.dn === this.dialogData.identity;
  }
}
