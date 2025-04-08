import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appSettingsRoutes } from '@features/settings/app-settings.route';

@NgModule({
  imports: [RouterModule.forChild(appSettingsRoutes)],
  exports: [RouterModule],
})
export class AppSettingsRoutingModule {}
