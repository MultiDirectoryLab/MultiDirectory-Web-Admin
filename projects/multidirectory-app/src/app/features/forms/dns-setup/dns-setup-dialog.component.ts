import { Component, inject, OnInit } from '@angular/core';
import { DnsSetupComponent } from '@features/forms/dns-setup/dns-setup/dns-setup.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { ButtonComponent, ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-dns-setup-dialog',
  templateUrl: './dns-setup-dialog.component.html',
  styleUrls: ['./dns-setup-dialog.component.scss'],
  imports: [DnsSetupComponent, TranslocoPipe, ButtonComponent],
})
export class DnsSetupDialogComponent implements OnInit {
  private modalControl = inject(ModalInjectDirective);

  dnsSetupRequest = new DnsSetupRequest({});
  formValid = false;

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
