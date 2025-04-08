import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PropertiesModule } from '@features/ldap-properties/properties.module';
import { TranslocoModule } from '@jsverse/transloco';
import { PlaceholderHeaderComponent } from './placeholder-header/placeholder-header.component';
import { PlaceholderComponent } from './placeholder.component';

@NgModule({
  imports: [
    TranslocoModule,
    CommonModule,
    PropertiesModule,
    PropertiesModule,
    PlaceholderComponent,
    PlaceholderHeaderComponent,
  ],
  exports: [RouterModule],
})
export class PlaceholderModule {}
