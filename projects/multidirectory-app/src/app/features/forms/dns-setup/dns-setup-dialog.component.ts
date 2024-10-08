import { Component, OnInit } from '@angular/core';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-dns-setup-dialog',
  templateUrl: './dns-setup-dialog.component.html',
  styleUrls: ['./dns-setup-dialog.component.scss'],
})
export class DnsSetupDialogComponent implements OnInit {
  dnsSetupRequest = new DnsSetupRequest({});
  formValid = false;

  constructor(private modalControl: ModalInjectDirective) {}

  ngOnInit(): void {
    this.dnsSetupRequest = this.modalControl.contentOptions['dnsSetupRequest'];
  }

  onClose() {
    this.modalControl.close(null);
  }

  onFinish(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.formValid) {
      this.modalControl.close(this.dnsSetupRequest);
    }
  }
}
