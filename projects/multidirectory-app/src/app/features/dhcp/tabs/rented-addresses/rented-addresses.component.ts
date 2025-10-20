import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DhcpApiService } from '@services/dhcp-api.service';
import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';
import { TReservationList } from '@models/api/dhcp/dhcp-reservations.model';
import { TRentedList } from '@models/api/dhcp/dhcp-rented.model';

@Component({
  selector: 'rented-addresses',
  templateUrl: './rented-addresses.component.html',
  styleUrls: ['./rented-addresses.component.scss'],
  imports: [DatagridComponent, TranslocoPipe],
})
export default class DhcpRentedAddressesComponent implements OnInit {
  private readonly dhcp = inject(DhcpApiService);
  @Input() subnet!: Subnet;
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected rows: {
    clientIpAddress: string;
    name: string;
    expiration: string;
  }[] = [];
  // rows = [
  //   { clientIpAddress: '192.168.51.10', name: 'PC-001', expiration: 'dd.mm.yyyy hh:mm:ss' },
  //   { clientIpAddress: '192.168.51.50', name: 'PC-005', expiration: 'dd.mm.yyyy hh:mm:ss' },
  // ];
  columns = [
    { name: translate('rented-addresses.clientIpAddress'), prop: 'clientIpAddress', flexGrow: 1 },
    { name: translate('rented-addresses.name'), prop: 'name', flexGrow: 1 },
    { name: translate('rented-addresses.expiration'), prop: 'expiration', flexGrow: 1 },
  ];
  private dialogService: any;

  ngOnInit(): void {
    this.getList();
    this.dhcp.$rentedList.subscribe((data) => {
      data?.list?.[this.subnet.id] && this.updateRows(data?.list?.[this.subnet.id]);
      this.cdr.detectChanges();
    });
  }

  getList() {
    this.dhcp.getRentedList(this.subnet.id);
  }

  updateRows(data: TRentedList) {
    this.rows = [];
    data.forEach((item) =>
      this.rows.push({
        clientIpAddress: item.ip_address,
        name: item.hostname,
        expiration: item.expires,
      }),
    );
  }
}
