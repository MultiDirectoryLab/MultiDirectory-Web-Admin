import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { Constants } from '@core/constants';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { AppWindowsService } from '@services/app-windows.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-acccess-policy',
  templateUrl: './access-policy.component.html',
  styleUrls: ['./access-policy.component.scss'],
})
export class AccessPolicyComponent {
  @Input() index = 0;
  @Output() deleteClick = new EventEmitter<AccessPolicy>();
  @Output() turnOffClick = new EventEmitter<AccessPolicy>();
  @Output() editClick = new EventEmitter<AccessPolicy>();

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

  ipAddress = '';

  groups = '';
  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private windows: AppWindowsService,
  ) {}

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

    this.windows.openConfirmDialog(prompt).subscribe((result) => {
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
