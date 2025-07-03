import { Component, inject } from '@angular/core';
import { DialogComponent } from '../../../components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MuiButtonComponent, MuiInputComponent } from '@mflab/mui-kit';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { DnsApiService } from '@services/dns-api.service';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { IpListDialogComponent } from '@components/modals/components/dialogs/access-policy-ip-list/ip-list-dialog.component';
import { IplistDialogData } from '@components/modals/interfaces/ip-list-dialog.interface';
import { take } from 'rxjs';
import { IpOption, IpRange } from '@core/access-policy/access-policy-ip-address';
import { DnsZoneParam } from '@models/dns/zones/dns-add-zone-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-zone-dialog',
  templateUrl: './add-zone-dialog.component.html',
  styleUrls: ['./add-zone-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    DialogComponent,
    TranslocoModule,
    MultidirectoryUiKitModule,
    CommonModule,
  ],
})
export class AddZoneDialogComponent {
  private api = inject(DnsApiService);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);

  form = new FormGroup({
    zone_name: new FormControl('md.new.zone'),
    ttl: new FormControl(8600),
    params: new FormControl([] as DnsZoneParam[]),
    ipString: new FormControl(''),
  });

  onSumbit(event: SubmitEvent) {
    this.api
      .addZone({
        zone_name: this.form.value.zone_name!,
        params: this.form.value.params!,
        zone_type: 'master',
      })
      .subscribe((result) => {
        this.dialogService.close(this.dialogRef, result);
      });
  }

  openIpAddressDialog() {
    this.dialogService
      .open<IplistDialogData, IplistDialogData, IpListDialogComponent>({
        component: IpListDialogComponent,
        dialogConfig: {
          data: {
            addresses: this.toIpOption(this.form.value.ipString ?? '') ?? [],
          },
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.form.value.ipString = this.fromIpOption(result.addresses);
        this.form.value.params = this.form.value.params?.filter((x) => x.name !== 'acl') ?? [];
        this.form.value.params.push(
          new DnsZoneParam({
            name: 'acl',
            value: this.fromIpOption(result.addresses),
          }),
        );
      });
  }

  onIpAddressChange() {
    this.form.value.params = this.form.value.params?.filter((x) => x.name !== 'acl') ?? [];
    this.form.value.params.push(
      new DnsZoneParam({
        name: 'acl',
        value: [this.form.value.ipString ?? ''],
      }),
    );
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
