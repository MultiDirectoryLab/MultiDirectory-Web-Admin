import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { filter, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-policies-navigation',
  templateUrl: './policies-navigation.component.html',
  styleUrls: ['./policies-navigation.component.scss'],
  imports: [TranslocoDirective, RouterLink, CommonModule],
})
export class PoliciesNavigationComponent implements OnDestroy {
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
