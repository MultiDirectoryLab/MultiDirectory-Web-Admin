import { Component, inject } from '@angular/core';
import { DialogComponent } from '../../../components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MuiButtonComponent, MuiInputComponent } from '@mflab/mui-kit';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { DnsApiService } from '@services/dns-api.service';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { IpListDialogComponent } from '@components/modals/components/dialogs/access-policy-ip-list/ip-list-dialog.component';
import { IplistDialogData } from '@components/modals/interfaces/ip-list-dialog.interface';
import { take } from 'rxjs';
import { IpOption, IpRange } from '@core/access-policy/access-policy-ip-address';
import { DnsAddZoneRequest, DnsZoneParam } from '@models/dns/zones/dns-add-zone-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-zone-dialog',
  templateUrl: './add-zone-dialog.component.html',
  styleUrls: ['./add-zone-dialog.component.scss'],
  imports: [FormsModule, DialogComponent, TranslocoModule, MultidirectoryUiKitModule, CommonModule],
})
export class AddZoneDialogComponent {
  private api = inject(DnsApiService);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);

  dnsZone = new DnsAddZoneRequest({
    zone_type: 'master',
  });

  onSumbit(event: SubmitEvent) {
    this.api.addZone(this.dnsZone).subscribe((result) => {
      this.dialogService.close(this.dialogRef, result);
    });
  }

  openIpAddressDialog() {
    let aclParams = this.dnsZone.params.find((x) => x.name == 'acl');
    if (!aclParams) {
      aclParams = new DnsZoneParam({ name: 'acl', value: [] });
      this.dnsZone.params.push(aclParams);
    }

    let address: IpOption[] = [];
    if (aclParams.value instanceof Array) {
      address = aclParams.value.flatMap((x) => this.toIpOption(x));
    }

    this.dialogService
      .open<IplistDialogData, IplistDialogData, IpListDialogComponent>({
        component: IpListDialogComponent,
        dialogConfig: {
          data: {
            addresses: address,
          },
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }
        let aclParams = this.dnsZone.params.find((x) => x.name == 'acl');
        if (!aclParams) {
          aclParams = new DnsZoneParam({ name: 'acl', value: [] });
          this.dnsZone.params.push(aclParams);
        }
        this._ipString = this.fromIpOption(result.addresses);
        aclParams.value = this._ipString.split(',').map((x) => x.trim());
      });
  }

  private _ipString = '';
  get ipString() {
    return this._ipString;
  }
  set ipString(x: string) {
    this._ipString = x;
    let aclParams = this.dnsZone.params.find((x) => x.name == 'acl');
    if (!aclParams) {
      aclParams = new DnsZoneParam({ name: 'acl', value: [] });
      this.dnsZone.params.push(aclParams);
    }
    aclParams.value = this.fromIpOption(this.toIpOption(x))
      .split(',')
      .map((x) => x.trim());
  }

  toIpOption(ipString: string): IpOption[] {
    return ipString.split(',').map((x) => {
      x = x.trim();
      if (x.includes('-')) {
        const parts = x.split('-').map((x) => x.trim());
        return new IpRange({
          start: parts[0],
          end: parts[1],
        });
      }
      return x.trim();
    });
  }

  fromIpOption(ips: IpOption[]) {
    return ips.map((x: any) => (x instanceof Object ? x.start + '-' + x.end : x)).join(', ');
  }
}
