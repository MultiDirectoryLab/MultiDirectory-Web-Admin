import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DownloadService } from '@services/download.service';
import { MdPortalComponent, SpinnerComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { DownloadComponent } from './components/app-layout/shared/download-dict.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    MdPortalComponent,
    SpinnerComponent,
    TranslocoPipe,
    DownloadComponent,
    NgClass,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private windows = inject(AppWindowsService);
  private app = inject(AppSettingsService);
  private download = inject(DownloadService);

  title = 'multidirectory-app';
  darkMode = false;
  @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;
  @ViewChild('downloadData') downloadComponent!: DownloadComponent;
  private unsubscribe = new Subject<void>();

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
