import { NgModule } from '@angular/core';
import { WindowsComponent } from './windows/windows.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { PropertiesModule } from '@features/ldap-properties/properties.module';
import { AppFormsModule } from '@features/forms/forms.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlateListItemComponent } from './plate-list-item/plate-list-item.component';
import { SetupKerberosDialogComponent } from '@features/forms/setup-kerberos/setup-kerberos.component';

@NgModule({
  exports: [WindowsComponent, NotificationsComponent, PlateListItemComponent],
  imports: [
    MultidirectoryUiKitModule,
    CommonModule,
    TranslocoModule,
    AppFormsModule,
    PropertiesModule,
    FontAwesomeModule,
    SetupKerberosDialogComponent,
    WindowsComponent,
    NotificationsComponent,
    PlateListItemComponent,
  ],
})
export class SharedComponentsModule {}
