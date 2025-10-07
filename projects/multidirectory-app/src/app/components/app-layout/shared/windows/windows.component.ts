import { AfterViewInit, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DnsSetupDialogComponent } from '@features/forms/dns-setup/dns-setup-dialog.component';
import { SetupKerberosDialogComponent } from '@features/forms/setup-kerberos/setup-kerberos.component';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';
import { AppWindowsService } from '@services/app-windows.service';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { take } from 'rxjs';

@Component({
  selector: 'app-windows',
  styleUrls: ['./windows.component.scss'],
  templateUrl: './windows.component.html',
  imports: [ModalInjectDirective, SetupKerberosDialogComponent, DnsSetupDialogComponent],
})
export class WindowsComponent implements AfterViewInit {
  private readonly ldapWindows: AppWindowsService = inject(AppWindowsService);
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);
  readonly setupKerberosDialog = viewChild.required<ModalInjectDirective>('setupKerberosDialog');
  readonly dnsSetupDialog = viewChild.required<ModalInjectDirective>('dnsSetupDialog');

  ngAfterViewInit(): void {
    this.ldapWindows.showSetupKerberosDialogRx
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(() => {
        this.openSetupKerberosDialog();
      });

    this.ldapWindows.showDnsSetupDialogRx
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((dnsSetupRequest) => {
        this.openDnsSetupDialog(dnsSetupRequest);
      });

    this.ldapWindows.showDhcpSetupDialogRx
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((dhcpSetupRequest) => {
        this.openDhcpSetupDialog(dhcpSetupRequest);
      });
  }

  openSetupKerberosDialog() {
    this.setupKerberosDialog()
      .open({ minHeight: 400 }, {})
      .pipe(take(1), takeUntilDestroyed(this.destroyRef$))
      .subscribe(() => {
        this.ldapWindows.closeSetupKerberosDialog();
      });
  }

  openDnsSetupDialog(dnsSetupRequest: DnsSetupRequest) {
    this.dnsSetupDialog()
      .open({ minHeight: 460 }, { dnsSetupRequest: dnsSetupRequest })
      .pipe(take(1), takeUntilDestroyed(this.destroyRef$))
      .subscribe((result) => {
        this.ldapWindows.closeDnsSetupDialog(result);
      });
  }

  openDhcpSetupDialog(dnsSetupRequest: DhcpSetupRequest) {
    this.dnsSetupDialog()
      .open({ minHeight: 460 }, { dhcpSetupRequest: DhcpSetupRequest })
      .pipe(take(1), takeUntilDestroyed(this.destroyRef$))
      .subscribe((result) => {
        this.ldapWindows.closeDhcpSetupDialog(result);
      });
  }
}
