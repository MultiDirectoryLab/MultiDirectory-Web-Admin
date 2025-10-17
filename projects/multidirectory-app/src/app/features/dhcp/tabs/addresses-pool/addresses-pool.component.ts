import { Component, inject, Input } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';

import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';

@Component({
  selector: 'addresses-pool',
  templateUrl: './addresses-pool.component.html',
  styleUrls: ['./addresses-pool.component.scss'],
  imports: [DatagridComponent, ButtonComponent, TranslocoPipe],
})
export default class AddressesPoolComponent {
  private dialogService = inject(DialogService);
  private _subnet!: Subnet;
  protected rows: any[] = [];
  @Input() set subnet(subnet: Subnet) {
    this._subnet = subnet;

    this.rows = [
      {
        startPath: this._subnet.pool[0].split('-')[0],
        endPath: this._subnet.pool[0].split('-')[1],
      },
    ];
  }
  get subnet(): Subnet {
    return this._subnet;
  }
  columns = [
    { name: translate('dhcp-areas.startPath'), prop: 'startPath', flexGrow: 1 },
    { name: translate('dhcp-areas.endPath'), prop: 'endPath', flexGrow: 1 },
    // { name: translate('dhcp-areas.desc'), prop: 'desc', flexGrow: 1 },
  ];

  onAddDhcpArea() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DHCPSetupWizardComponent>({
        component: DHCPSetupWizardComponent,
        dialogConfig: {
          width: '550px',
          data: this.subnet,
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
