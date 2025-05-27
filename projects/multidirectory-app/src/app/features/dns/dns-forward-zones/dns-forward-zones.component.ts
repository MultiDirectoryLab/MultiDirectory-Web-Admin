import { Component, inject, signal } from '@angular/core';
import { RedirectZonesRow } from '@features/dns/interfaces/redirect-zones.interface';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, DatagridComponent, Page } from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from '../../../components/modals/services/dialog.service';

@Component({
  selector: 'app-dns-forward-zones',
  imports: [ButtonComponent, TranslocoPipe, DatagridComponent],
  templateUrl: './dns-forward-zones.component.html',
  styleUrl: './dns-forward-zones.component.scss',
})
export class DnsForwardZonesComponent {
  private toastr: ToastrService = inject(ToastrService);
  private dialogService: DialogService = inject(DialogService);

  public redirectionZonesColumns: TableColumn[] = [
    { name: 'Имя зоны', prop: 'zoneName', flexGrow: 1 },
    { name: 'Состояние', prop: 'status', flexGrow: 1 },
    { name: 'Перенаправление зон', prop: 'redirection', flexGrow: 1 },
  ];
  public redirectionZonesRows: RedirectZonesRow[] = [
    {
      zoneName: 'Зона 1',
      status: 'Включена',
      redirection: 'example.com',
    },
    {
      zoneName: 'Зона 2',
      status: 'Выключена',
      redirection: '1.2.3.4',
    },
    {
      zoneName: 'Зона 3',
      status: 'Включена',
      redirection: '192.168.1.10',
    },
  ];
  public redirectionZonesPage = new Page();
  private selectedRedirectionZones = signal<RedirectZonesRow[]>([]);

  public onAddRedirectionZone() {
    this.toastr.info('Add redirection zone functionality will be implemented in the future');
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
      this.toastr.error(translate('dns-settings.should-select-zones'));
      return;
    }

    this.toastr.info('Delete redirection zone functionality will be implemented in the future');
  }

  public onRedirectionZonesSelectionChanged(rows: RedirectZonesRow[]) {
    this.selectedRedirectionZones.set(rows);
  }
}
