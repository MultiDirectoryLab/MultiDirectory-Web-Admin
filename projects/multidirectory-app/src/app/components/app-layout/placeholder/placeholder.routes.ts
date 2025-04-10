import { Routes } from '@angular/router';

export const placeholderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./placeholder.component').then((c) => c.PlaceholderComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./placeholder-header/placeholder-header.component').then(
        (c) => c.PlaceholderHeaderComponent,
      ),
    outlet: 'header',
  },
];
