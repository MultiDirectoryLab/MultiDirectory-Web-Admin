import { NgClass } from '@angular/common';
import { Component, DestroyRef, HostBinding, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DownloadService } from '@services/download.service';
import { MdPortalComponent, SpinnerComponent } from 'multidirectory-ui-kit';
import { DownloadComponent } from './components/app-layout/shared/download-dict.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    SpinnerComponent,
    TranslocoPipe,
    DownloadComponent,
    NgClass,
    MdPortalComponent,
  ],
})
export class AppComponent implements OnInit {
  private windows = inject(AppWindowsService);
  private app = inject(AppSettingsService);
  private download = inject(DownloadService);
  private destroyRef$: DestroyRef = inject(DestroyRef);
  title = 'multidirectory-app';
  @HostBinding('class.dark-theme') darkMode = false;
  readonly spinner = viewChild.required<SpinnerComponent>('spinner');
  readonly downloadComponent = viewChild.required<DownloadComponent>('downloadData');

  ngOnInit(): void {
    this.windows.globalSpinnerRx.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((show) => {
      if (show) {
        this.spinner().show();
      } else {
        this.spinner().hide();
      }
    });

    this.app.darkModeRx.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.darkMode = x;
    });

    this.download.downlaodDictRx
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(([data, name]) => {
        this.downloadComponent().downloadDict(data, name);
      });
  }
}
