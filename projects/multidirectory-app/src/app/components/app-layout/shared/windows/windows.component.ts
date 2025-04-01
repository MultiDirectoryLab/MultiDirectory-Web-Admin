import { AfterViewInit, Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { AppWindowsService } from '@services/app-windows.service';
import { take } from 'rxjs';
import { MdModalModule, ModalInjectDirective } from 'multidirectory-ui-kit';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { SetupKerberosDialogComponent } from '@features/forms/setup-kerberos/setup-kerberos.component';
import { DnsSetupDialogComponent } from '@features/forms/dns-setup/dns-setup-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-windows',
  styleUrls: ['./windows.component.scss'],
  templateUrl: './windows.component.html',
  standalone: true,
  imports: [MdModalModule, SetupKerberosDialogComponent, DnsSetupDialogComponent],
})
export class WindowsComponent implements AfterViewInit {
  @ViewChild('setupKerberosDialog') setupKerberosDialog!: ModalInjectDirective;
  @ViewChild('dnsSetupDialog') dnsSetupDialog!: ModalInjectDirective;
  private readonly ldapWindows: AppWindowsService = inject(AppWindowsService);
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    this.ldapWindows.showSetupKerberosDialogRx
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((x) => {
        this.openSetupKerberosDialog();
      });

    this.ldapWindows.showDnsSetupDialogRx
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((dnsSetupRequest) => {
        this.openDnsSetupDialog(dnsSetupRequest);
      });
  }

  openSetupKerberosDialog() {
    this.setupKerberosDialog
      .open({ minHeight: 400 }, {})
      .pipe(take(1), takeUntilDestroyed(this.destroyRef$))
      .subscribe((result) => {
        this.ldapWindows.closeSetupKerberosDialog();
      });
  }

  openDnsSetupDialog(dnsSetupRequest: DnsSetupRequest) {
    this.dnsSetupDialog
      .open({ minHeight: 460 }, { dnsSetupRequest: dnsSetupRequest })
      .pipe(take(1), takeUntilDestroyed(this.destroyRef$))
      .subscribe((result) => {
        this.ldapWindows.closeDnsSetupDialog(result);
      });
  }
}
