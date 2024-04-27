import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MultifactorSettingsComponent } from './mulifactor-settings/multifactor-settings.component';
import { AuthRouteGuard } from '@core/authorization/auth-route-guard';
import { MultidirectorySettingsComponent } from './multidirectory-settings/multidirectory-settings.component';
import { AppSettingsNavigationComponent } from './navigation/app-settings-navigation.component';

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
        path: '',
        component: MultidirectorySettingsComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppSettingsRoutingModule {}
