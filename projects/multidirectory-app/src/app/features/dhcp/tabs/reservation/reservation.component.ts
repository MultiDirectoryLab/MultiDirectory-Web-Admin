import { Component, inject } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import { DialogService } from '@components/modals/services/dialog.service';
import { DhcpAddReservationComponent } from '@features/dhcp/dhcp-add-reservation/dhcp-add-reservation.component';

@Component({
  selector: 'reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  imports: [DatagridComponent, ButtonComponent, TranslocoPipe],
})
export default class DhcpReservationComponent {
  private dialogService = inject(DialogService);
  rows = [
    { macAddress: '', clientIpAddress: '192.168.51.10', name: 'PC-001', desc: '' },
    { macAddress: '', clientIpAddress: '192.168.51.50', name: 'PC-005', desc: '' },
  ];
  columns = [
    { name: translate('tabReservation.macAddress'), prop: 'macAddress', flexGrow: 1 },
    { name: translate('tabReservation.clientIpAddress'), prop: 'clientIpAddress', flexGrow: 1 },
    { name: translate('tabReservation.name'), prop: 'name', flexGrow: 1 },
    { name: translate('tabReservation.desc'), prop: 'desc', flexGrow: 1 },
  ];

  edit() {
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
  add() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DhcpAddReservationComponent>({
        component: DhcpAddReservationComponent,
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

  onRowSelect() {
    console.log('onRowSelect');
  }
}
