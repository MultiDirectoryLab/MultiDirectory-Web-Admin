import { NgModule } from '@angular/core';
import { PlaceholderComponent } from './placeholder.component';
import { PlaceholderHeaderComponent } from './placeholder-header/placeholder-header.component';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { CommonModule } from '@angular/common';
import { PropertiesModule } from '../../../features/ldap-properties/properties.module';

@NgModule({
  declarations: [PlaceholderComponent, PlaceholderHeaderComponent],
  imports: [
    TranslocoModule,
    CommonModule,
    MultidirectoryUiKitModule,
    PropertiesModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlaceholderComponent,
      },
      {
        path: '',
        component: PlaceholderHeaderComponent,
        outlet: 'header',
      },
    ]),
    PropertiesModule,
  ],
  exports: [RouterModule],
})
export class PlaceholderModule {}
