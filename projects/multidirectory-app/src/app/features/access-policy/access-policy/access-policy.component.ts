import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { Constants } from '@core/constants';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, take } from 'rxjs';
import { NgClass } from '@angular/common';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule } from '@angular/forms';
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
  standalone: true,
  imports: [NgClass, MultidirectoryUiKitModule, FormsModule],
})
export class AccessPolicyComponent {
  @Input() index = 0;
  @Output() deleteClick = new EventEmitter<AccessPolicy>();
  @Output() turnOffClick = new EventEmitter<AccessPolicy>();
  @Output() editClick = new EventEmitter<AccessPolicy>();
  ipAddress = '';
  groups = '';
  private dialogService: DialogService = inject(DialogService);
  private toastr: ToastrService = inject(ToastrService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

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
