import { Component, inject, OnInit } from '@angular/core';
import { MuiTabDirective, MuiTabsComponent } from '@mflab/mui-kit';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { DnsApiService } from '@services/dns-api.service';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogService } from '@components/modals/services/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import DhcpAreasItem from '@features/dhcp/dhcp-areas-item/dhcp-areas-item';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import { DhcpAreaListResponse } from '@models/dhcp/areas/dns-area-response';

@Component({
  selector: 'dhcp-areas',
  templateUrl: './dhcp-areas.component.html',
  styleUrls: ['./dhcp-areas.component.scss'],
  imports: [MultidirectoryUiKitModule, TranslocoModule, DhcpAreasItem],
})
export default class DhcpAreasComponent implements OnInit {
  private dns = inject(DnsApiService);
  private dialogService = inject(DialogService);
  areas: number[] = [1, 2];
  // areas: DhcpAreaListResponse[] = [1, 2];

  listDnsZones(name: string = '') {}

  ngOnInit(): void {
    // this.dns.zone().subscribe((x) => {
    //   this.zones = x;
    // });
  }
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

  // onAddDnsZone() {
  //   this.dialogService
  //     .open<AddZoneDialogReturnData, AddZoneDialogData, AddZoneDialogComponent>({
  //       component: AddZoneDialogComponent,
  //       dialogConfig: {
  //         data: {},
  //       },
  //     })
  //     .closed.pipe(
  //       switchMap((result) => {
  //         return this.dns.zone();
  //       }),
  //     )
  //     .subscribe((result: DnsZoneListResponse[]) => {
  //       if (!result) {
  //         return;
  //       }
  //       this.zones = result;
  //     });
  // }
}
