import { Component, inject, OnInit, signal } from '@angular/core';
import { RedirectZonesRow } from '@features/dns/interfaces/redirect-zones.interface';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, DatagridComponent, DropdownOption } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { CommonModule } from '@angular/common';
import { DnsApiService } from '@services/dns-api.service';
import { DnsForwardGetData, DnsForwardZone } from '@models/api/dns/dns-forward-zone';
import { AddForwardZoneDialogData, AddForwardZoneDialogReturnData } from './add-forward-zone-dialog/add-forward-zone-dialog.interface';
import { AddForwardZoneDialogComponent } from './add-forward-zone-dialog/add-forward-zone-dialog.component';
import { DnsAddZoneRequest } from '@models/dhcp/areas/dhcp-add-areas-response';
import { EMPTY, filter, switchMap, take } from 'rxjs';
import { TableColumn } from 'ngx-datatable-gimefork';

@Component({
  selector: 'app-dns-forward-zones',
  imports: [ButtonComponent, TranslocoPipe, DatagridComponent, CommonModule],
  templateUrl: './dns-forward-zones.component.html',
  styleUrl: './dns-forward-zones.component.scss',
})
export class DnsForwardZonesComponent implements OnInit {
  private toastr: ToastrService = inject(ToastrService);
  private dialogService: DialogService = inject(DialogService);
  private dnsApi: DnsApiService = inject(DnsApiService);

  redirectionZonesColumns: TableColumn[] = [
    { name: 'Имя зоны', prop: 'name', flexGrow: 1 },
    { name: 'Состояние', prop: 'type', flexGrow: 1 },
    { name: 'Перенаправление зон', prop: 'redirection', flexGrow: 1 },
  ];
  redirectionZonesRows = signal<DnsForwardZone[]>([]);

  limit = 20;
  offset = 0;
  total = 0;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.dnsApi.getForwardZones().subscribe((forwardZones: DnsForwardZone[]) => {
      this.selectedRedirectionZones.set([]);
      this.redirectionZonesRows.set(forwardZones);
      this.total = forwardZones.length;
    });
  }

  selectedRedirectionZones = signal<DnsForwardGetData[]>([]);

  onAddRedirectionZone() {
    this.dialogService
      .open<AddForwardZoneDialogReturnData, AddForwardZoneDialogData, AddForwardZoneDialogComponent>({
        component: AddForwardZoneDialogComponent,
        dialogConfig: {
          minWidth: '620px',
          data: new DnsForwardZone({}),
        },
      })
      .closed.pipe(
        take(1),
        filter((x) => !!x),
        switchMap((result: DnsForwardZone) => {
          if (!result) {
            return EMPTY;
          }
          return this.dnsApi.addForwardZone(result);
        }),
      )
      .subscribe((result) => {
        this.loadData();
      });
  }

  onEditRedirectionZone($event: any) {
    const dialogData = new DnsForwardZone({ servers: ($event.row as DnsForwardGetData).servers, zone_name: ($event as any).row.name });
    this.dialogService
      .open<AddForwardZoneDialogReturnData, AddForwardZoneDialogData, AddForwardZoneDialogComponent>({
        component: AddForwardZoneDialogComponent,
        dialogConfig: {
          minWidth: '620px',
          data: dialogData,
        },
      })
      .closed.pipe(
        take(1),
        filter((x) => !!x),
        switchMap((result: DnsForwardZone) => {
          if (!result) {
            return EMPTY;
          }
          return this.dnsApi.changeForwardZones(result);
        }),
      )
      .subscribe((result) => {
        this.loadData();
      });
  }

  onEnableRedirectionZone() {
    this.toastr.info('Enable redirection zone functionality will be implemented in the future');
  }

  onDisableRedirectionZone() {
    this.toastr.info('Disable redirection zone functionality will be implemented in the future');
  }

  onDeleteRedirectionZone() {
    const selectedRows = this.selectedRedirectionZones();

    if (!selectedRows.length) {
      this.toastr.error(translate('dns-forward-zones.should-select-zones'));
      return;
    }

    this.dnsApi.deleteForwardZones(selectedRows.map((x) => x.id)).subscribe(() => {
      this.toastr.success(translate('dns-forward-zones.delete-successful'));
      this.loadData();
    });
  }

  onRedirectionZonesSelectionChanged(rows: DnsForwardGetData[]) {
    this.selectedRedirectionZones.set(rows);
  }
}
