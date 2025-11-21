import { ChangeDetectionStrategy, Component, inject, signal, viewChild, ViewChild } from '@angular/core';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ContextMenuService } from '../../../services/context-menu.service';
import { PasswordSuggestContextMenuComponent } from '../../context-menus/password-suggest-context-menu/password-suggest-context-menu.component';
import { DialogComponent } from '../../core/dialog/dialog.component';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormsModule, NgModel } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordValidatorDirective } from '@core/validators/password-validator.directive';
import { PasswordMatchValidatorDirective } from '@core/validators/passwordmatch.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { ChangePasswordRequest } from '@models/api/user/change-password-request';
import { ContextMenuRef } from '@models/core/context-menu/context-menu-ref';
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
  protected changeRequest = new ChangePasswordRequest({ identity: this.dialogData.identity });
  protected passwordPolicy = new PasswordPolicy();
  private suggestDialogRef: ContextMenuRef<unknown, PasswordSuggestContextMenuComponent> | null = null;
  private password = signal('');

  private dialogRef: DialogRef<ChangePasswordDialogReturnData, ChangePasswordDialogComponent> = inject(DialogRef);
  private dialogService: DialogService = inject(DialogService);
  private toastr: ToastrService = inject(ToastrService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private contextMenuService = inject(ContextMenuService);

  ngOnInit() {
    this.loadPasswordPolicy();
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
          this.toastr.error(translate('change-password.unable-change-password'));
          this.dialogService.close(this.dialogRef);
          this.dialog().hideSpinner();
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
    if (this.passwordInput().valid) {
      this.closeSuggest();
    }
  }

  protected openSuggest(event: FocusEvent): void {
    const target = ((event as unknown as Event).target as HTMLElement).parentElement as HTMLElement;
    const targetRect = target.getBoundingClientRect();

    this.suggestDialogRef = this.contextMenuService.open({
      contextMenuConfig: {
        hasBackdrop: false,
        data: { password: this.password, policy: this.passwordPolicy },
      },
      component: PasswordSuggestContextMenuComponent,
      y: targetRect.y,
      x: targetRect.right + 8,
    });
  }

  private closeSuggest(): void {
    if (this.suggestDialogRef) {
      this.suggestDialogRef.close(null);
    }
  }

  private loadPasswordPolicy() {
    this.api.getDefaultPasswordPolicy().subscribe((policy) => (this.passwordPolicy = policy));
  }
}
