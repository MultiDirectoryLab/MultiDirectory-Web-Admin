import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationNode } from '@core/navigation/navigation-node';

@Injectable({
  providedIn: 'root',
})
export class AppNavigationService {
  constructor(private router: Router) {}

  navigate(node: NavigationNode) {
    if (!node.route) {
      return;
    }

    this.router.navigate(node.route, {
      queryParams: node.routeData,
    });
  }
}
