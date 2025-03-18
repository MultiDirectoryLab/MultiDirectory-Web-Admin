import { Component, OnDestroy } from '@angular/core';
import { WhoamiResponse } from '@models/api/whoami/whoami-response';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
})
export class AppSettingsComponent implements OnDestroy {
  user: WhoamiResponse | null = null;
  unsubscribe = new Subject<void>();

  constructor() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
