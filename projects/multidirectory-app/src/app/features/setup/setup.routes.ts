import { Routes } from '@angular/router';

export const setupRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/setup/setup/setup.component').then((c) => c.SetupComponent),
  },
];
