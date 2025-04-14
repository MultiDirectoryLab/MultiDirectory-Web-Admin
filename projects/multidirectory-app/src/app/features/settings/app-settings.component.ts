import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
  imports: [RouterOutlet],
})
export class AppSettingsComponent implements OnDestroy {
  user: WhoamiResponse | null = null;
  unsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
