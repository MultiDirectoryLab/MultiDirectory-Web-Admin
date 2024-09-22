import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MultifactorSettingsComponent } from './mulifactor-settings/multifactor-settings.component';
import { AuthRouteGuard } from '@core/authorization/auth-route-guard';
import { MultidirectorySettingsComponent } from './multidirectory-settings/multidirectory-settings.component';
import { AppSettingsNavigationComponent } from './navigation/app-settings-navigation.component';
import { AboutComponent } from './about/about.component';
import { KerberosPrincipalsComponent } from './kerberos-principals/kerberos-principals.component';
import { FooterComponent } from '../../components/app-layout/footer/footer.component';
import { DnsSettingsComponent } from '../dns/dns-settings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        outlet: 'sidebar',
        component: AppSettingsNavigationComponent,
      },
      {
        path: 'multifactor',
        component: MultifactorSettingsComponent,
        canActivate: [AuthRouteGuard],
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
        path: '',
        component: MultidirectorySettingsComponent,
      },
      {
        path: '',
        component: FooterComponent,
        outlet: 'footer',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppSettingsRoutingModule {}
