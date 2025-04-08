import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { AppSettingsService } from '@services/app-settings.service';
import { AlertComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [AlertComponent, FaIconComponent, TranslocoPipe],
})
export class FooterComponent implements OnInit, OnDestroy {
  faCircleExclamation = faCircleExclamation;
  KerberosStatusEnum = KerberosStatuses;
  kerberosStatus = KerberosStatuses.READY;
  private _unsubscribe = new Subject<void>();

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
