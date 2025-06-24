import { NgClass } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { filter, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-settings-navigation',
  templateUrl: './app-settings-navigation.component.html',
  styleUrls: ['./app-settings-navigation.component.scss'],
  imports: [TranslocoDirective, RouterLink, NgClass],
})
export class AppSettingsNavigationComponent implements OnDestroy {
  private navigation = inject(AppNavigationService);

  url = '';
  _unsubscribe = new Subject<void>();

  constructor() {
    this.navigation.navigationEnd.subscribe(() => {
      this.url = this.navigation.url;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
