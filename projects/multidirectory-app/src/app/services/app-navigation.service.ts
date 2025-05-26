import { L } from '@angular/cdk/a11y-module.d-9e4162d8';
import { inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, startWith, take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppNavigationService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  get navigationEnd(): Observable<NavigationEnd> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith({} as NavigationEnd),
    );
  }

  get url(): string {
    return this.router.url;
  }

  get snapshot(): ActivatedRouteSnapshot {
    return this.activatedRoute.snapshot;
  }

  navigate(route: string[], queryParams: Params) {
    if (!route) {
      return;
    }

    this.router.navigate(route, {
      queryParams: queryParams,
      onSameUrlNavigation: 'reload',
    });
  }

  reload() {
    this.router.navigateByUrl(this.router.url);
  }
}
