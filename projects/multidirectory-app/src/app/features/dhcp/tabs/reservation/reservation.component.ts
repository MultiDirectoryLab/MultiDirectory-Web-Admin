import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import { DialogService } from '@components/modals/services/dialog.service';
import { DhcpAddReservationComponent } from '@features/dhcp/dhcp-add-reservation/dhcp-add-reservation.component';
import { Subnet, TSubnetsList } from '@models/api/dhcp/dhcp-subnet.model';
import { DhcpApiService } from '@services/dhcp-api.service';
import { IReservation, TReservationList } from '@models/api/dhcp/dhcp-reservations.model';
import { catchError } from 'rxjs';

@Component({
  selector: 'reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  imports: [
    DatagridComponent,
    ButtonComponent,
    TranslocoPipe,
    ButtonComponent,
    ButtonComponent,
    ButtonComponent,
  ],
})
export default class DhcpReservationComponent implements OnInit {
  private dialogService = inject(DialogService);
  private readonly dhcp = inject(DhcpApiService);
  private _subnet!: Subnet;
  protected rows: any[] = [];
  protected selectedReservation: IReservation | undefined;
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  @Input() subnet!: Subnet;
  columns = [
    { name: translate('tabReservation.macAddress'), prop: 'mac_address', flexGrow: 1 },
    { name: translate('tabReservation.ipAddress'), prop: 'ip_address', flexGrow: 1 },
    { name: translate('tabReservation.name'), prop: 'hostname', flexGrow: 1 },
  ];

  ngOnInit(): void {
    this.getList();
    this.dhcp.$reservationsList.subscribe((data) => {
      data?.list?.[this.subnet.id] && this.updateRows(data?.list?.[this.subnet.id]);
      this.cdr.detectChanges();
    });
  }

  getList() {
    this.dhcp.getReservationsList(this.subnet.id);
  }

  updateRows(data: TReservationList) {
    this.rows = [];
    data.forEach((item) =>
      this.rows.push({
        ip_address: item.ip_address,
        hostname: item.hostname,
        mac_address: item.mac_address,
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
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DhcpAddReservationComponent>({
        component: DhcpAddReservationComponent,
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

  onRowSelect(event: TReservationList) {
    this.selectedReservation = event[0];
    console.log(event);
  }

  protected readonly event = event;
}
