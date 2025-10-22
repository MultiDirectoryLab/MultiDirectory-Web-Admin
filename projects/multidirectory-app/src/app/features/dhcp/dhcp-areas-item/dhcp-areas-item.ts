import { Component, inject, Input, OnInit } from '@angular/core';
import { MuiTabDirective, MuiTabsComponent } from '@mflab/mui-kit';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import DhcpAreasComponent from '@features/dhcp/tabs/rented-addresses/rented-addresses.component';
import AddressesPoolComponent from '@features/dhcp/tabs/addresses-pool/addresses-pool.component';
import DhcpReservationComponent from '@features/dhcp/tabs/reservation/reservation.component';
import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';
import { catchError } from 'rxjs';
import { DhcpApiService } from '@services/dhcp-api.service';

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
  ],
})
export default class DhcpAreasItem implements OnInit {
  @Input() index!: string;
  @Input() subnet!: Subnet;
  private api: any;
  private readonly dhcp = inject(DhcpApiService);
  ngOnInit(): void {}
  deleteArea() {
    this.dhcp
      .deleteDhcpSubnet(this.subnet.id)
      .pipe(
        catchError((err) => {
          throw err;
        }),
      )
      .subscribe(() => {
        this.dhcp.getAreasList();
      });
  }
}
