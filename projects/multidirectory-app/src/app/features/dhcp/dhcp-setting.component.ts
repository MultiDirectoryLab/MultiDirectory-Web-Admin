import { Component, inject, OnInit } from '@angular/core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { DhcpStatuses } from '@models/api/dhcp/dhcp-statuses';
import { DialogService } from '@components/modals/services/dialog.service';
import DhcpAreasComponent from '@features/dhcp/dhcp-areas/dhcp-areas.component';
import { DhcpApiService } from '@services/dhcp-api.service';
import { AlertComponent, ButtonComponent } from 'multidirectory-ui-kit';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoPipe } from '@jsverse/transloco';
import { TSubnetsList } from '@models/api/dhcp/dhcp-subnet.model';
import { AppWindowsService } from '@services/app-windows.service';
import { EMPTY, switchMap, take } from 'rxjs';
import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';
import { DhcpDialogSetupReturnData } from '@components/modals/interfaces/dhcp-setup-wizard-dialog.interface';
import { DHCPSetupWizardComponent } from '@features/dhcp/dhcp-setup-wizard/dhcp-setup-wizard.component';

@Component({
  selector: 'app-dhcp-settings',
  templateUrl: './dhcp-setting.component.html',
  styleUrls: ['./dhcp-setting.component.scss'],
  imports: [DhcpAreasComponent, ButtonComponent, FaIconComponent, AlertComponent, TranslocoPipe],
})
export class DhcpSettingComponent implements OnInit {
  dhcpStatuses = DhcpStatuses;
  subnetsList: TSubnetsList = [];
  subnetsExists: boolean = false;
  private readonly dhcp = inject(DhcpApiService);
  private dialogService = inject(DialogService);
  private windows: AppWindowsService = inject(AppWindowsService);

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.dhcp.getAreasList();
    this.dhcp.$areaList.subscribe((data: TSubnetsList) => {
      this.subnetsList = data;
      this.subnetsExists = data.length > 0;
    });
    // this.dhcp.getDhcpSubnets().subscribe((data: TSubnetsList) => {
    //   this.dhcp.areaList = data;
    //   this.subnetsList = data;
    //   this.subnetsExists = data.length > 0;
    // });
  }

  handleSetupClick() {
    this.dialogService
      .open<DhcpDialogSetupReturnData, object, object>({
        component: DHCPSetupWizardComponent,
        dialogConfig: {
          width: '550px',
          data: {},
        },
      })
      .closed.pipe() //   .pipe(
      //   switchMap((result) => {
      //     return this.dns.zone();
      //   }),
      // )
      .subscribe((result: any) => {
        if (!result) {
          return;
        }
        this.dialogService.close(result.data);
        this.getList();
      });
  }

  protected readonly faCircleExclamation = faCircleExclamation;
}
