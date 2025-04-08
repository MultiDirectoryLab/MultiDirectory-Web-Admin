import { Routes } from '@angular/router';
import { authRouteGuardCanActivateFn } from '@core/authorization/auth-route.can-activate.guard';
import { DnsSettingsComponent } from '@features/dns/dns-settings.component';
import { AboutComponent } from '@features/settings/about/about.component';
import { KerberosPrincipalsComponent } from '@features/settings/kerberos-principals/kerberos-principals.component';
import { MultifactorSettingsComponent } from '@features/settings/mulifactor-settings/multifactor-settings.component';
import { MultidirectorySettingsComponent } from '@features/settings/multidirectory-settings/multidirectory-settings.component';
import { AppSettingsNavigationComponent } from '@features/settings/navigation/app-settings-navigation.component';
import { SessionsComponent } from '@features/settings/sessions/sessions.component';
import { FooterComponent } from '../../components/app-layout/footer/footer.component';

export const appSettingsRoutes: Routes = [
  {
    path: '',
    outlet: 'sidebar',
    component: AppSettingsNavigationComponent,
  },
  {
    path: 'multifactor',
    component: MultifactorSettingsComponent,
    canActivate: [authRouteGuardCanActivateFn],
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'kdc-principals',
    component: KerberosPrincipalsComponent,
  },
  {
    path: 'dns',
    component: DnsSettingsComponent,
  },
  {
    path: 'sessions',
    component: SessionsComponent,
  },
  {
    path: '',
    component: MultidirectorySettingsComponent,
  },
  {
    path: '',
    component: FooterComponent,
    outlet: 'footer',
  },
];
