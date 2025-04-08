import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PropertiesModule } from '@features/ldap-properties/properties.module';
import { TranslocoModule } from '@jsverse/transloco';
import { PlaceholderHeaderComponent } from './placeholder-header/placeholder-header.component';
import { PlaceholderComponent } from './placeholder.component';
import { placeholderRoutes } from './placeholder.route';

@NgModule({
  imports: [
    TranslocoModule,
    CommonModule,
    PropertiesModule,
    RouterModule.forChild(placeholderRoutes),
    PropertiesModule,
    PlaceholderComponent,
    PlaceholderHeaderComponent,
  ],
  exports: [RouterModule],
})
export class PlaceholderModule {}
