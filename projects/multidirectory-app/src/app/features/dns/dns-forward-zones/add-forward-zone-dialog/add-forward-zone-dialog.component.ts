import { Component, inject, OnInit } from '@angular/core';
import { DialogComponent } from '../../../../components/modals/components/core/dialog/dialog.component';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { DialogService } from '@components/modals/services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AddForwardZoneDialogData } from './add-forward-zone-dialog.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { P } from 'node_modules/@angular/cdk/portal-directives.d-DbeNrI5D';
import { DnsApiService } from '@services/dns-api.service';
import {
  DnsCheckForwardZoneRequest,
  DnsCheckForwardZoneResponse,
} from '@models/api/dns/dns-check-forward-zone';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faClose, faCross, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  imports: [
    DialogComponent,
    TranslocoModule,
    MultidirectoryUiKitModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './add-forward-zone-dialog.component.html',
  styleUrl: './add-forward-zone-dialog.component.scss',
})
export class AddForwardZoneDialogComponent implements OnInit {
  private dialog = inject(DialogService);
  private dns = inject(DnsApiService);
  private dialogData = inject<AddForwardZoneDialogData>(DIALOG_DATA);
  private dialogRef = inject(DialogRef);
  faCheck = faCheck;
  faCross = faClose;
  zone = this.dialogData;
  selectedForwaderIndex?: number;
  forwarderResponse = new Map<number, DnsCheckForwardZoneResponse>();
  tooltip = translate('add-forward-zone-dialog.tooltip');
  ngOnInit(): void {
    const checkRequest = new DnsCheckForwardZoneRequest({ dns_server_ips: this.zone.forwarders });
    this.dns.checkForwardZone(checkRequest).subscribe((response) => {
      response.forEach((value, index) => {
        this.forwarderResponse?.set(index, value);
      });
    });
  }

  onDeleteForwarderClick(toDelete: string) {
    this.zone.forwarders = this.zone.forwarders.filter((forwarder) => forwarder !== toDelete);
    this.selectedForwaderIndex = undefined;
  }

  moveDown() {
    if (this.selectedForwaderIndex == undefined) {
      return;
    }
    const temp = this.zone.forwarders?.[this.selectedForwaderIndex + 1];
    this.zone.forwarders[this.selectedForwaderIndex + 1] =
      this.zone.forwarders[this.selectedForwaderIndex];
    this.zone.forwarders[this.selectedForwaderIndex] = temp;
    this.selectedForwaderIndex++;
  }
  moveUp() {
    if (this.selectedForwaderIndex == undefined) {
      return;
    }

    const temp = this.zone.forwarders?.[this.selectedForwaderIndex - 1];
    this.zone.forwarders[this.selectedForwaderIndex - 1] =
      this.zone.forwarders[this.selectedForwaderIndex];
    this.zone.forwarders[this.selectedForwaderIndex] = temp;
    this.selectedForwaderIndex--;
  }

  addForwarder() {
    this.zone.forwarders.push('');
  }

  submitForwarder(form: NgForm, index: number) {
    this.dns
      .checkForwardZone(new DnsCheckForwardZoneRequest({ dns_server_ips: [form.value.ip] }))
      .subscribe((response) => {
        this.forwarderResponse?.set(index, response[0]);
      });
  }

  apply() {
    this.dialog.close(this.dialogRef, this.zone);
  }
  cancel() {
    this.dialog.close(this.dialogRef, null);
  }
}
