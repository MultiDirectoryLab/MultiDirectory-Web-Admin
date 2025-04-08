import { Routes } from '@angular/router';

export const loginRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/login/login.component').then((c) => c.LoginComponent),
  },
];
