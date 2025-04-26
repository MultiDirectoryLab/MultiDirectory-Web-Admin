import { Injectable } from '@angular/core';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppWindowsService {
  private _toggleGlobalSpinnerRx = new Subject<boolean>();

  get globalSpinnerRx(): Observable<boolean> {
    return this._toggleGlobalSpinnerRx.asObservable();
  }

  private _showSetupKerberosDialogRx = new Subject<void>();

  get showSetupKerberosDialogRx(): Observable<void> {
    return this._showSetupKerberosDialogRx.asObservable();
  }

  private _closeSetupKerberosDialogRx = new Subject<void>();

  get closeSetupKerberosDialogRx(): Observable<void> {
    return this._closeSetupKerberosDialogRx.asObservable();
  }

  private _showDnsSetupDialogRx = new Subject<DnsSetupRequest>();

  get showDnsSetupDialogRx(): Observable<DnsSetupRequest> {
    return this._showDnsSetupDialogRx.asObservable();
  }

  private _closeDnsSetupDialogRx = new Subject<DnsSetupRequest>();

  get closeDnsSetupDialogRx(): Observable<DnsSetupRequest> {
    return this._closeDnsSetupDialogRx.asObservable();
  }

  hideSpinner() {
    this._toggleGlobalSpinnerRx.next(false);
  }

  showSpinner() {
    this._toggleGlobalSpinnerRx.next(true);
  }

  openSetupKerberosDialog() {
    this._showSetupKerberosDialogRx.next();
    return this.closeSetupKerberosDialogRx;
  }

  closeSetupKerberosDialog() {
    return this._closeSetupKerberosDialogRx.next();
  }

  openDnsSetupDialog(rule: DnsSetupRequest) {
    this._showDnsSetupDialogRx.next(rule);
    return this.closeDnsSetupDialogRx;
  }

  closeDnsSetupDialog(rule: DnsSetupRequest) {
    return this._closeDnsSetupDialogRx.next(rule);
  }
}
