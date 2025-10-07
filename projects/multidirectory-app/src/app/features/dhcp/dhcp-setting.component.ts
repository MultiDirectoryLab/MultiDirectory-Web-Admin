import { Component, inject, OnInit } from '@angular/core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { DhcpStatuses } from '@models/api/dhcp/dhcp-statuses';
import { DhcpStatusResponse } from '@models/api/dhcp/dhcp-status-response';
import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import { DialogService } from '@components/modals/services/dialog.service';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import DhcpAreasComponent from '@features/dhcp/dhcp-areas/dhcp-areas.component';

@Component({
  selector: 'app-dhcp-settings',
  templateUrl: './dhcp-setting.component.html',
  styleUrls: ['./dhcp-setting.component.scss'],
  imports: [DhcpAreasComponent],
})
export class DhcpSettingComponent implements OnInit {
  dhcpStatuses = DhcpStatuses;
  dhcpStatus = new DhcpStatusResponse({});
  private dialogService = inject(DialogService);

  ngOnInit(): void {}
  handleSetupClick() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DHCPSetupWizardComponent>({
        component: DHCPSetupWizardComponent,
        dialogConfig: {
          width: '550px',
          data: {},
        },
      })
      .closed //   .pipe(
      //   switchMap((result) => {
      //     return this.dns.zone();
      //   }),
      // )
      .subscribe((result: any) => {
        if (!result) {
          return;
        }
        // this.zones = result;
      });
  }

  protected readonly faCircleExclamation = faCircleExclamation;
}
