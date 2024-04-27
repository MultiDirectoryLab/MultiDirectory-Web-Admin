import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppWindowsService } from './services/app-windows.service';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerComponent } from 'multidirectory-ui-kit';
import { AppSettingsService } from './services/app-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  title = 'multidirectory-app';
  darkMode = false;
  @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;

  constructor(
    private windows: AppWindowsService,
    private app: AppSettingsService,
  ) {}

  ngOnInit(): void {
    this.windows.globalSpinnerRx.pipe(takeUntil(this.unsubscribe)).subscribe((show) => {
      if (show) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });

    this.app.darkModeRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.darkMode = x;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
