import { Component, inject, Input, OnInit } from '@angular/core';
import { DnsApiService } from '@services/dns-api.service';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogService } from '@components/modals/services/dialog.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import DhcpAreasItem from '@features/dhcp/dhcp-areas-item/dhcp-areas-item';
import {
  DhcpDialogSetupDialogData,
  DhcpDialogSetupReturnData,
} from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';
import { TSubnetsList } from '@models/api/dhcp/dhcp-subnet.model';
import { DhcpApiService } from '@services/dhcp-api.service';
import { ValidationFunctions } from '@core/validators/validator-functions';
import { catchError, EMPTY } from 'rxjs';
import { ILease } from '@models/api/dhcp/dhcp-lease.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dhcp-areas',
  templateUrl: './dhcp-areas.component.html',
  styleUrls: ['./dhcp-areas.component.scss'],
  imports: [MultidirectoryUiKitModule, TranslocoModule, DhcpAreasItem, FormsModule],
})
export default class DhcpAreasComponent {
  @Input() subnetsList!: TSubnetsList;
  /**
   * Индекс вкладки арендованных адресов
   * Сейчас функционал опирается на фиксированный порядок вкладок.
   */
  private readonly leaseTabIndex = 1;
  private dialogService = inject(DialogService);
  private dchpApi = inject(DhcpApiService);
  areas: number[] = [1, 2];
  searchQuery = '';
  /**
   * Выбранные вкладки для подсети
   * @key индекс подсети
   * @value индекс выбранной вкладки
   */
  subnetTabSelection = new Map<string, number>();
  protected leaseTabSelected!: boolean;

  onAddDhcpArea() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, DhcpDialogSetupDialogData, DHCPSetupWizardComponent>({
        component: DHCPSetupWizardComponent,
        dialogConfig: {
          width: '550px',
          data: {},
        },
      })
      .closed.subscribe();
  }

  protected setSelectedTab(subnetId: string, tabIndex: number) {
    this.subnetTabSelection.set(subnetId, tabIndex);
    this.leaseTabSelected = tabIndex === this.leaseTabIndex;
  }

  /**
   * Поиск выполняется во всех областях, с выбранной вкладкой Арендованные адреса
   */
  protected searchLease() {
    // пустой запрос - ищем все аренды, обновляем во всех подсетях
    if (!this.searchQuery) {
      const tabsSelection = Array.from(this.subnetTabSelection);
      const subnetsWithSelectedLeaseTab = tabsSelection.filter(
        (x: [string, number]) => x[1] === this.leaseTabIndex,
      );
      const subnetIdsToSearch = subnetsWithSelectedLeaseTab.map((x) => x[0]);

      subnetIdsToSearch.forEach((subnetId) => {
        this.dchpApi.getLeasesList(subnetId);
      });
    } else {
      const searchFor = ValidationFunctions.macAddress(this.searchQuery)
        ? 'mac_address'
        : 'hostname';
      this.dchpApi
        .searchAllDhcpLeases(searchFor, this.searchQuery)
        .pipe(
          catchError(() => {
            // при отсутствии результатов возникает ошибка, скрываем ее
            return EMPTY;
          }),
        )
        .subscribe((x: ILease) => {
          const id = x.subnet_id;
          this.dchpApi.leaseList = {
            list: {
              [id]: [x],
            },
          };
        });
    }
  }
}
