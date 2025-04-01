import { Component, DestroyRef, HostBinding, inject, OnInit, ViewChild } from '@angular/core';
import { DownloadService } from '@services/download.service';
import { MdPortalModule, MdSpinnerModule, SpinnerComponent } from 'multidirectory-ui-kit';
import { DownloadComponent } from './components/app-layout/shared/download-dict.component';
import { AppSettingsService } from './services/app-settings.service';
import { AppWindowsService } from './services/app-windows.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, MdPortalModule, MdSpinnerModule, DownloadComponent, TranslocoPipe],
})
export class AppComponent implements OnInit {
  public title = 'multidirectory-app';
  @HostBinding('class.dark-theme') darkMode = false;
  @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;
  @ViewChild('downloadData') downloadComponent!: DownloadComponent;
  private windows: AppWindowsService = inject(AppWindowsService);
  private app: AppSettingsService = inject(AppSettingsService);
  private download: DownloadService = inject(DownloadService);
  private destroyRef$: DestroyRef = inject(DestroyRef);

  constructor() {}

  ngOnInit(): void {
    this.windows.globalSpinnerRx.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((show) => {
      if (show) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });

    this.app.darkModeRx.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.darkMode = x;
    });

    this.download.downlaodDictRx
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(([data, name]) => {
        this.downloadComponent.downloadDict(data, name);
      });
  }
}
