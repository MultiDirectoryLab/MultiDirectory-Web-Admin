import { Component, OnDestroy } from '@angular/core';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { Subject } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
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
