import { Routes } from '@angular/router';
import { authRouteGuardCanActivateFn } from '@core/authorization/auth-route.can-activate.guard';

export const appSettingsRoutes: Routes = [
  {
    path: '',
    outlet: 'sidebar',
    loadComponent: () =>
      import('@features/settings/navigation/app-settings-navigation.component').then(
        (c) => c.AppSettingsNavigationComponent,
      ),
  },
  {
    path: 'multifactor',
    loadComponent: () =>
      import('@features/settings/mulifactor-settings/multifactor-settings.component').then(
        (c) => c.MultifactorSettingsComponent,
      ),
    canActivate: [authRouteGuardCanActivateFn],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('@features/settings/about/about.component').then((c) => c.AboutComponent),
  },
  {
    path: 'kdc-principals',
    loadComponent: () =>
      import('@features/settings/kerberos-principals/kerberos-principals.component').then(
        (c) => c.KerberosPrincipalsComponent,
      ),
  },
  {
    path: 'dns',
    loadComponent: () =>
      import('@features/dns/dns-settings.component').then((c) => c.DnsSettingsComponent),
  },
  {
    path: 'dns/:zone',
    loadComponent: () =>
      import('@features/dns/dns-zone-details/dns-zone-details.component').then(
        (c) => c.DnsZoneDetailsComponent,
      ),
  },
  {
    path: 'sessions',
    loadComponent: () =>
      import('@features/settings/sessions/sessions.component').then((c) => c.SessionsComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('@features/settings/multidirectory-settings/multidirectory-settings.component').then(
        (c) => c.MultidirectorySettingsComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('../../components/app-layout/footer/footer.component').then((c) => c.FooterComponent),
    outlet: 'footer',
  },
];
