import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { Constants } from '@core/constants';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { PlaneButtonComponent, ShiftCheckboxComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, take } from 'rxjs';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { ConfirmDialogComponent } from '../../../components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../../components/modals/interfaces/confirm-dialog.interface';

@Component({
  selector: 'app-acccess-policy',
  templateUrl: './access-policy.component.html',
  styleUrls: ['./access-policy.component.scss'],
  imports: [NgClass, PlaneButtonComponent, ShiftCheckboxComponent, FormsModule],
})
export class AccessPolicyComponent {
  private dialogService: DialogService = inject(DialogService);
  private toastr: ToastrService = inject(ToastrService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  readonly index = input(0);
  readonly deleteClick = output<AccessPolicy>();
  readonly turnOffClick = output<AccessPolicy>();
  readonly editClick = output<AccessPolicy>();
  ipAddress = '';
  groups = '';

  _accessClient: AccessPolicy | null = null;

  get accessClient(): AccessPolicy | null {
    return this._accessClient;
  }

  @Input() set accessClient(accessClient: AccessPolicy | null) {
    this._accessClient = accessClient;
    if (this._accessClient) {
      this.ipAddress = this._accessClient.ipRange
        .map((x) => (x instanceof Object ? x.start + '-' + x.end : x))
        .join(', ');
      this.groups = this._accessClient.groups
        .map((x) => {
          const name = new RegExp(Constants.RegexGetNameFromDn).exec(x);
          return name?.[1] ?? x;
        })
        .join(', ');
    }
  }

  onDeleteClick() {
    if (!this.accessClient) {
      this.toastr.error(translate('access-policy.client-does-not-exist'));
      return;
    }

    const prompt: ConfirmDialogDescriptor = {
      promptHeader: translate('remove-confirmation-dialog.prompt-header'),
      promptText: translate('remove-confirmation-dialog.prompt-text'),
      primaryButtons: [{ id: 'yes', text: translate('remove-confirmation-dialog.yes') }],
      secondaryButtons: [{ id: 'cancel', text: translate('remove-confirmation-dialog.cancel') }],
    };

    this.dialogService
      .open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>({
        component: ConfirmDialogComponent,
        dialogConfig: {
          minHeight: '160px',
          data: prompt,
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (result === 'yes') {
          this.deleteClick.emit(this.accessClient!);
          return;
        }
        return EMPTY;
      });
  }

  onTurnOffClick() {
    if (!this.accessClient) {
      this.toastr.error(translate('access-policy.client-does-not-exist'));
      return;
    }
    this.turnOffClick.emit(this.accessClient);
    this.cdr.detectChanges();
  }

  onEditClick() {
    if (!this.accessClient) {
      this.toastr.error(translate('access-policy.client-does-not-exist'));
      return;
    }
    this.editClick.emit(this.accessClient);
    this.cdr.detectChanges();
  }
}
