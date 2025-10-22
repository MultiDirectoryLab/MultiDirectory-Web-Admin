import { Component, inject, Input, OnInit } from '@angular/core';
import { DnsApiService } from '@services/dns-api.service';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogService } from '@components/modals/services/dialog.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import DhcpAreasItem from '@features/dhcp/dhcp-areas-item/dhcp-areas-item';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import { TSubnetsList } from '@models/api/dhcp/dhcp-subnet.model';

@Component({
  selector: 'dhcp-areas',
  templateUrl: './dhcp-areas.component.html',
  styleUrls: ['./dhcp-areas.component.scss'],
  imports: [MultidirectoryUiKitModule, TranslocoModule, DhcpAreasItem],
})
export default class DhcpAreasComponent {
  @Input() subnetsList!: TSubnetsList;
  private dns = inject(DnsApiService);
  private dialogService = inject(DialogService);
  areas: number[] = [1, 2];

  onAddDhcpArea() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DHCPSetupWizardComponent>({
        component: DHCPSetupWizardComponent,
        dialogConfig: {
          width: '550px',
          data: {},
        },
      })
      .closed.subscribe((result: any) => {
        if (!result) {
          return;
        }
        // this.zones = result;
      });
  }
}
