import { Routes } from '@angular/router';
import { PlaceholderHeaderComponent } from './placeholder-header/placeholder-header.component';
import { PlaceholderComponent } from './placeholder.component';

export const placeholderRoute: Routes = [
  {
    path: '',
    component: PlaceholderComponent,
  },
  {
    path: '',
    component: PlaceholderHeaderComponent,
    outlet: 'header',
  },
];
