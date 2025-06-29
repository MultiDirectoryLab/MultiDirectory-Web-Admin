import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppSettingsService } from '@services/app-settings.service';

@Component({
  selector: 'app-schema-browser-header',
  imports: [],
  templateUrl: './schema-browser-header.component.html',
  styleUrl: './schema-browser-header.component.scss',
})
export class SchemaBrowserHeaderComponent implements OnInit {
  settings = inject(AppSettingsService);
  destroyRef = inject(DestroyRef);
  header = '';
  ngOnInit(): void {
    this.settings.headerTitleRx.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.header = value;
    });
  }
}
