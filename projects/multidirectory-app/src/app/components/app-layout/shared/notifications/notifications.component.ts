import { Component, OnDestroy, OnInit } from '@angular/core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { AppSettingsService } from '@services/app-settings.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { Subject, takeUntil } from 'rxjs';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [MultidirectoryUiKitModule, FaIconComponent, TranslocoPipe],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  faCircleExclamation = faCircleExclamation;
  KerberosStatusEnum = KerberosStatuses;
  kerberosStatus = KerberosStatuses.READY;
  private _unsubscribe = new Subject<void>();

  constructor(
    private api: MultidirectoryApiService,
    private app: AppSettingsService,
  ) {}

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
