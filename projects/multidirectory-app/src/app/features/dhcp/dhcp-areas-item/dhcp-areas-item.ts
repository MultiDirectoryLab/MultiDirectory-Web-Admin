import { Component, Input, OnInit } from '@angular/core';
import { MuiTabDirective, MuiTabsComponent } from '@mflab/mui-kit';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import DhcpAreasComponent from '@features/dhcp/tabs/rented-addresses/rented-addresses.component';
import AddressesPoolComponent from '@features/dhcp/tabs/addresses-pool/addresses-pool.component';
import DhcpReservationComponent from '@features/dhcp/tabs/reservation/reservation.component';
import DhcpAreaParametersComponent from '@features/dhcp/tabs/area-parameters/area-parameters.component';
import { catchError, EMPTY, take } from 'rxjs';

@Component({
  selector: 'dhcp-areas-item',
  templateUrl: './dhcp-areas-item.html',
  styleUrls: ['./dhcp-areas-item.scss'],
  imports: [
    MultidirectoryUiKitModule,
    TranslocoModule,
    MuiTabDirective,
    MuiTabsComponent,
    DhcpAreasComponent,
    AddressesPoolComponent,
    DhcpReservationComponent,
    DhcpAreaParametersComponent,
  ],
})
export default class DhcpAreasItem implements OnInit {
  @Input() index!: number;
  private api: any;
  ngOnInit(): void {}
  deleteArea() {
    // this.api
    //   .deleteSession(this.sessionId)
    //   .pipe(
    //     take(1),
    //     catchError(() => EMPTY),
    //   )
    //   .subscribe(() => {
    //     const currentSessions = this.sessions();
    //     this.sessions.set(currentSessions.filter((s) => s.session_id !== sessionId));
    //   });
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
