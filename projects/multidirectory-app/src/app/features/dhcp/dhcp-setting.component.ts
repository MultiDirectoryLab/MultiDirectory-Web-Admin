import { Component, inject, OnInit } from '@angular/core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from '@components/modals/services/dialog.service';
import DhcpAreasComponent from '@features/dhcp/dhcp-areas/dhcp-areas.component';
import { DhcpApiService } from '@services/dhcp-api.service';
import { AlertComponent, ButtonComponent } from 'multidirectory-ui-kit';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoPipe } from '@jsverse/transloco';
import { TSubnetsList } from '@models/api/dhcp/dhcp-subnet.model';
import { AppWindowsService } from '@services/app-windows.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dhcp-settings',
  templateUrl: './dhcp-setting.component.html',
  styleUrls: ['./dhcp-setting.component.scss'],
  imports: [
    DhcpAreasComponent,
    ButtonComponent,
    FaIconComponent,
    AlertComponent,
    TranslocoPipe,
    AsyncPipe,
  ],
})
export class DhcpSettingComponent implements OnInit {
  subnetsList: TSubnetsList = [];
  private readonly dhcp = inject(DhcpApiService);
  $subnetsExists: Observable<boolean> = this.dhcp.$dhcpStatus;
  private dialogService = inject(DialogService);
  private windows: AppWindowsService = inject(AppWindowsService);

  ngOnInit(): void {
    // изменить на подписку на getDhcpStatus
    this.getStatus();
  }

  getStatus() {
    this.dhcp.getDhcpStatus();
    this.dhcp.$dhcpStatus.subscribe((status: boolean) => {
      status && this.getList();
    });
  }

  getList() {
    this.dhcp.getAreasList();
    this.dhcp.$areaList.subscribe((data: TSubnetsList) => {
      this.subnetsList = data;
      // this.subnetsExists = data.length > 0;
    });
  }

  handleSetupClick() {
    this.dhcp.setup({ dhcp_manager_state: '1' }).subscribe((status) => status && this.getList());
  }

  protected readonly faCircleExclamation = faCircleExclamation;
}
