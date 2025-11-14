import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { DatagridComponent } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DhcpApiService } from '@services/dhcp-api.service';
import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';
import { ContextMenuEvent } from 'ngx-datatable-gimefork';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { DhcpAddLeaseComponent } from '@features/dhcp/dhcp-add-lease/dhcp-add-lease.component';
import { TLeasesList } from '@models/api/dhcp/dhcp-lease.model';
import { RentedIpAddress } from '@models/api/dhcp/dhcp-rented-ip.model';
import { ContextMenuService } from '@components/modals/services/context-menu.service';
import {
  RentedIpContextMenuComponent
} from '@components/modals/components/context-menus/rented-ip-context-menu/rented-ip-context-menu.component';
import { catchError, EMPTY, filter, switchMap } from 'rxjs';
import { ConfirmDialogData, ConfirmDialogReturnData } from '@components/modals/interfaces/confirm-dialog.interface';
import { ConfirmDialogComponent } from '@components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DhcpLeaseToReservationResponse, DhcpReservationRequest } from '@models/api/dhcp/dhcp-create-reservation-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'rented-addresses',
  templateUrl: './rented-addresses.component.html',
  styleUrls: ['./rented-addresses.component.scss'],
  imports: [DatagridComponent, TranslocoPipe]
})
export default class DhcpRentedAddressesComponent implements OnInit {
  private readonly dhcp = inject(DhcpApiService);
  @Input() subnet!: Subnet;
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected rows: RentedIpAddress[] = [];
  protected selectedIpAddresses: RentedIpAddress[] = [];

  columns = [
    { name: translate('rented-addresses.clientIpAddress'), prop: 'clientIpAddress', flexGrow: 1 },
    { name: translate('rented-addresses.name'), prop: 'name', flexGrow: 1 },
    { name: translate('rented-addresses.expiration'), prop: 'expiration', flexGrow: 1 },
  ];
  private contextMenuService = inject(ContextMenuService);
  private dialogService = inject(DialogService);
  private toastr = inject(ToastrService);

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
    this.rows = data.map(x => new RentedIpAddress(x.ip_address, x.mac_address, x.hostname, x.expires));
  }

  add() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DhcpAddLeaseComponent>({
        component: DhcpAddLeaseComponent,
        dialogConfig: {
          width: '550px',
          data: this.subnet
        },
      })
      .closed.subscribe((result: any) => {
        if (!result) {
          return;
        }
      });
  }

  onSelect(addresses: RentedIpAddress[]) {
    this.selectedIpAddresses = addresses;
  }

  private createReservationRequest(): DhcpReservationRequest[] {
    return this.selectedIpAddresses.map(x => new DhcpReservationRequest({subnet_id: this.subnet.id, ip_address: x.clientIpAddress, mac_address: x.macAddress, hostname: x.name}));
  }

  private getReservationPromptText(data: RentedIpAddress[]): string {
    if (data.length > 1) {
      const ips = data.map(x => x.clientIpAddress).join(', ');
      const clients = data.map(x => x.name).join(', ');
      return `${translate('rented-addresses.confirm-reserve-many')} ${ips} ${translate('rented-addresses.confirm-reserve-many-client')} ${clients}?`;
    }
    return `${translate('rented-addresses.confirm-reserve-one')} ${data[0].clientIpAddress} ${translate('rented-addresses.confirm-reserve-one-client')} ${data[0].name}?`;
  }

  private openConfirmReservationDialog(data: RentedIpAddress[]) {
    return this.dialogService.open<
      ConfirmDialogReturnData,
      ConfirmDialogData,
      ConfirmDialogComponent
    >({
      component: ConfirmDialogComponent,
      dialogConfig: {
        minHeight: '160px',
        data: {
          promptText: this.getReservationPromptText(data),
          promptHeader: translate('confirmation-dialog.prompt-header'),
          primaryButtons: [{ id: true, text: translate('confirmation-dialog.yes') }],
          secondaryButtons: [{ id: false, text: translate('confirmation-dialog.cancel') }],
        }
      }
    }).closed;
  }

  protected openContextMenu(e: ContextMenuEvent<RentedIpAddress>) {
    const addresses = this.selectedIpAddresses.length ? this.selectedIpAddresses : ((e.content && [e.content as RentedIpAddress]) || []);

    if (!addresses.length) {
      return;
    }

    const ctxMenuRef = this.contextMenuService.open({
      component: RentedIpContextMenuComponent,
      x: e.event.x,
      y: e.event.y,
      contextMenuConfig: {
        hasBackdrop: false,
        minWidth: 'auto',
        minHeight: 'auto',
      }
    });

    ctxMenuRef.closed.pipe(
      filter(Boolean),
      switchMap(() =>  this.openConfirmReservationDialog(addresses)),
      filter(Boolean),
      switchMap(() => {
        const request = this.createReservationRequest();
        return this.dhcp.leaseToReservation(request);
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastr.error(translate('rented-addresses.fail-to-reserve') + (err.error?.detail || err.message));
        return EMPTY;
      })
    ).subscribe((x: DhcpLeaseToReservationResponse) => {
      this.getList();
      // массив IP возвращается только в случае успешной резервации части адресов
      if (x !== null && x.length > 0) {
        this.toastr.warning(`${translate('rented-addresses.partial-reserved')}\n\n${x.map(d => d.ip_address).join(`, `)}`);
      } else {
        this.toastr.success(translate('rented-addresses.success-reserved'));
      }
    });
  }
}
