import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DhcpApiService } from '@services/dhcp-api.service';
import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';
import { IReservation, TReservationList } from '@models/api/dhcp/dhcp-reservations.model';
import { catchError } from 'rxjs';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { DhcpAddLeaseComponent } from '@features/dhcp/dhcp-add-lease/dhcp-add-lease.component';
import { TLeasesList } from '@models/api/dhcp/dhcp-lease.model';

class TLeaseList {}

@Component({
  selector: 'rented-addresses',
  templateUrl: './rented-addresses.component.html',
  styleUrls: ['./rented-addresses.component.scss'],
  imports: [DatagridComponent, TranslocoPipe, ButtonComponent],
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
  protected selectedReservation: IReservation | undefined;
  columns = [
    { name: translate('rented-addresses.clientIpAddress'), prop: 'clientIpAddress', flexGrow: 1 },
    { name: translate('rented-addresses.name'), prop: 'name', flexGrow: 1 },
    { name: translate('rented-addresses.expiration'), prop: 'expiration', flexGrow: 1 },
  ];
  private dialogService = inject(DialogService);

  ngOnInit(): void {
    this.getList();
    this.dhcp.$leaseList.subscribe((data) => {
      data?.list?.[this.subnet.id] && this.updateRows(data?.list?.[this.subnet.id]);
      this.cdr.detectChanges();
    });
  }

  getList() {
    this.dhcp.getLeasesList(this.subnet.id);
  }

  updateRows(data: TLeasesList) {
    this.rows = [];
    data.forEach((item) =>
      this.rows.push({
        clientIpAddress: item.ip_address,
        name: item.hostname,
        expiration: item.expires,
      }),
    );
  }

  delete() {
    const selectedReservationExist =
      this.selectedReservation && Object.keys(this.selectedReservation).length > 0;
    selectedReservationExist &&
      this.dhcp
        .deleteDhcpReservation({
          ip_address: this.selectedReservation?.ip_address ?? '',
          mac_address: this.selectedReservation?.mac_address ?? '',
          subnet_id: this.subnet.id,
        })
        .pipe(
          catchError((err) => {
            throw err;
          }),
        )
        .subscribe(() => {
          this.dhcp.getReservationsList(this.subnet.id);
        });
  }
  add() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DhcpAddLeaseComponent>({
        component: DhcpAddLeaseComponent,
        dialogConfig: {
          width: '550px',
          data: this.subnet,
        },
      })
      .closed.subscribe((result: any) => {
        if (!result) {
          return;
        }
      });
  }

  onRowSelect(event: TReservationList) {
    this.selectedReservation = event[0];
  }
}
