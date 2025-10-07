import { Component } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'rented-addresses',
  templateUrl: './rented-addresses.component.html',
  styleUrls: ['./rented-addresses.component.scss'],
  imports: [DatagridComponent, TranslocoPipe],
})
export default class DhcpRentedAddressesComponent {
  rows = [
    { clientIpAddress: '192.168.51.10', name: 'PC-001', expiration: 'dd.mm.yyyy hh:mm:ss' },
    { clientIpAddress: '192.168.51.50', name: 'PC-005', expiration: 'dd.mm.yyyy hh:mm:ss' },
  ];
  columns = [
    { name: translate('rented-addresses.clientIpAddress'), prop: 'clientIpAddress', flexGrow: 1 },
    { name: translate('rented-addresses.name'), prop: 'name', flexGrow: 1 },
    { name: translate('rented-addresses.expiration'), prop: 'expiration', flexGrow: 1 },
  ];
  private dialogService: any;

  edit() {}
}
