import { Component, inject } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';

import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';

@Component({
  selector: 'addresses-pool',
  templateUrl: './addresses-pool.component.html',
  styleUrls: ['./addresses-pool.component.scss'],
  imports: [DatagridComponent, ButtonComponent, TranslocoPipe],
})
export default class AddressesPoolComponent {
  private dialogService = inject(DialogService);
  rows = [
    { startPath: '192.168.51.2', endPath: '192.168.51.40', desc: 'Описание' },
    { startPath: '192.168.51.10', endPath: '192.168.51.40', desc: '2Описание' },
  ];
  columns = [
    { name: translate('dhcp-areas.startPath'), prop: 'startPath', flexGrow: 1 },
    { name: translate('dhcp-areas.endPath'), prop: 'endPath', flexGrow: 1 },
    { name: translate('dhcp-areas.desc'), prop: 'desc', flexGrow: 1 },
  ];

  onAddDhcpArea() {
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
  selectionChanged() {}
}
