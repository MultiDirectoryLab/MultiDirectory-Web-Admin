import { Component, inject, OnInit, signal } from '@angular/core';
import { RedirectZonesRow } from '@features/dns/interfaces/redirect-zones.interface';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, DatagridComponent, DropdownOption } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { CommonModule } from '@angular/common';
import { DnsApiService } from '@services/dns-api.service';
import { DnsForwardZone } from '@models/api/dns/dns-forward-zone';
import {
  AddForwardZoneDialogData,
  AddForwardZoneDialogReturnData,
} from './add-forward-zone-dialog/add-forward-zone-dialog.interface';
import { AddForwardZoneDialogComponent } from './add-forward-zone-dialog/add-forward-zone-dialog.component';
import { DnsAddZoneRequest } from '@models/dns/zones/dns-add-zone-response';
import { EMPTY, switchMap, take } from 'rxjs';
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

  public redirectionZonesColumns: TableColumn[] = [
    { name: 'Имя зоны', prop: 'name', flexGrow: 1 },
    { name: 'Состояние', prop: 'type', flexGrow: 1 },
    { name: 'Перенаправление зон', prop: 'redirection', flexGrow: 1 },
  ];
  public redirectionZonesRows = signal<DnsForwardZone[]>([]);

  limit = 20;
  offset = 0;
  total = 0;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.dnsApi.getForwardZones().subscribe((forwardZones) => {
      this.selectedRedirectionZones.set([]);
      this.redirectionZonesRows.set(forwardZones);
      this.total = forwardZones.length;
    });
  }

  selectedRedirectionZones = signal<DnsForwardZone[]>([]);

  public onAddRedirectionZone() {
    this.dialogService
      .open<
        AddForwardZoneDialogReturnData,
        AddForwardZoneDialogData,
        AddForwardZoneDialogComponent
      >({
        component: AddForwardZoneDialogComponent,
        dialogConfig: {
          minWidth: '620px',
          data: new DnsForwardZone({}),
        },
      })
      .closed.pipe(
        take(1),
        switchMap((result) => {
          if (!result) {
            return EMPTY;
          }
          return this.dnsApi.addZone(result.toDnsAddZoneRequest());
        }),
      )
      .subscribe((result) => {
        this.loadData();
      });
  }

  onEditRedirectionZone($event: InputEvent) {
    this.dialogService
      .open<
        AddForwardZoneDialogReturnData,
        AddForwardZoneDialogData,
        AddForwardZoneDialogComponent
      >({
        component: AddForwardZoneDialogComponent,
        dialogConfig: {
          minWidth: '620px',
          data: new DnsForwardZone(($event as any).row as DnsForwardZone),
        },
      })
      .closed.pipe(
        take(1),
        switchMap((result) => {
          if (!result) {
            return EMPTY;
          }
          return this.dnsApi.updateZone(result.toDnsAddZoneRequest());
        }),
      )
      .subscribe((result) => {
        this.loadData();
      });
  }

  public onEnableRedirectionZone() {
    this.toastr.info('Enable redirection zone functionality will be implemented in the future');
  }

  public onDisableRedirectionZone() {
    this.toastr.info('Disable redirection zone functionality will be implemented in the future');
  }

  public onDeleteRedirectionZone() {
    const selectedRows = this.selectedRedirectionZones();

    if (!selectedRows.length) {
      this.toastr.error(translate('dns-forward-zones.should-select-zones'));
      return;
    }

    this.dnsApi.deleteZone(selectedRows.map((x) => x.name)).subscribe((x) => {
      this.toastr.success(translate('dns-forward-zones.delete-successful'));
      this.loadData();
    });
  }

  public onRedirectionZonesSelectionChanged(rows: DnsForwardZone[]) {
    this.selectedRedirectionZones.set(rows);
  }
}
