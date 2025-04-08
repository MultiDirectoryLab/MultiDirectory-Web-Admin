import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { setupRoutes } from '@features/setup/setup.route';

@NgModule({
  imports: [RouterModule.forChild(setupRoutes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
