import { ChangeDetectorRef, Component, inject, Input, input, output } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { PlaneButtonComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { take, EMPTY } from 'rxjs';
import { ConfirmDialogComponent } from '../../../components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ConfirmDialogReturnData,
  ConfirmDialogData,
} from '../../../components/modals/interfaces/confirm-dialog.interface';
import { DialogService } from '../../../components/modals/services/dialog.service';

@Component({
  selector: 'app-dns-rule-list-item',
  templateUrl: './dns-rule-list-item.component.html',
  styleUrls: ['./dns-rule-list-item.component.scss'],
  imports: [PlaneButtonComponent],
})
export class DnsRuleListItemComponent {
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(DialogService);

  readonly index = input(0);
  readonly deleteClick = output<DnsRule>();
  readonly turnOffClick = output<DnsRule>();
  readonly editClick = output<DnsRule>();

  _dnsRule: DnsRule | null = null;

  get dnsRule(): DnsRule | null {
    return this._dnsRule;
  }

  @Input() set dnsRule(dnsRule: DnsRule | null) {
    this._dnsRule = dnsRule;
  }

  onDeleteClick() {
    if (!this.dnsRule) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
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
          this.deleteClick.emit(this.dnsRule!);

          return;
        }
        return EMPTY;
      });
  }

  onTurnOffClick() {
    if (!this.dnsRule) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.turnOffClick.emit(this.dnsRule);
    this.cdr.detectChanges();
  }

  onEditClick() {
    if (!this.dnsRule) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.editClick.emit(this.dnsRule);
    this.cdr.detectChanges();
  }

  getType(type: DnsRuleType) {
    return DnsRuleType[type];
  }
}
