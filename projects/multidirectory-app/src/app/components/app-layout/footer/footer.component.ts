import { Component, OnDestroy, OnInit } from '@angular/core';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { AppSettingsService } from '@services/app-settings.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  private _unsubscribe = new Subject<void>();
  KerberosStatusEnum = KerberosStatuses;
  kerberosStatus = KerberosStatuses.READY;
  constructor(private app: AppSettingsService) {}

  ngOnInit(): void {
    this.app.kerberosStatusRx.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.kerberosStatus = x;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}