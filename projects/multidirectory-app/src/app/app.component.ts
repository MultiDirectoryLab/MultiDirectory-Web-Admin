import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppWindowsService } from './services/app-windows.service';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerComponent } from 'multidirectory-ui-kit';
import { AppSettingsService } from './services/app-settings.service';
import { DownloadService } from '@services/download.service';
import { DownloadComponent } from './components/app-layout/shared/download-dict.component';

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
  @ViewChild('downloadData') downloadComponent!: DownloadComponent;

  constructor(
    private windows: AppWindowsService,
    private app: AppSettingsService,
    private download: DownloadService,
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

    this.download.downlaodDictRx.pipe(takeUntil(this.unsubscribe)).subscribe(([data, name]) => {
      this.downloadComponent.downloadDict(data, name);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
