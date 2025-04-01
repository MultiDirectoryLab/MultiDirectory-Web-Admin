import { NgModule } from '@angular/core';
import { AppSettingsComponent } from './app-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppSettingsNavigationComponent } from './navigation/app-settings-navigation.component';
import { MultifactorSettingsComponent } from './mulifactor-settings/multifactor-settings.component';
import { AppSettingsRoutingModule } from './app-settings-routes.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultidirectorySettingsComponent } from './multidirectory-settings/multidirectory-settings.component';
import { MfIntegrationFormComponent } from './mulifactor-settings/mf-integration-form/mf-integration-form.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoModule } from '@jsverse/transloco';

import { AboutComponent } from './about/about.component';
import { KerberosPrincipalsComponent } from './kerberos-principals/kerberos-principals.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DnsSettingsModule } from '../dns/dns-settings.module';
import { SessionsModule } from '@features/settings/sessions/sessions.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AppSettingsRoutingModule,
    DragDropModule,
    TranslocoModule,
    MultidirectoryUiKitModule,
    FontAwesomeModule,
    RouterModule,
    DnsSettingsModule,
    SessionsModule,
    AppSettingsComponent,
    AppSettingsNavigationComponent,
    MultifactorSettingsComponent,
    MultidirectorySettingsComponent,
    MfIntegrationFormComponent,
    AboutComponent,
    KerberosPrincipalsComponent,
  ],
  exports: [
    AppSettingsComponent,
    AppSettingsNavigationComponent,
    MultifactorSettingsComponent,
    AppSettingsRoutingModule,
    MultidirectorySettingsComponent,
  ],
})
export class AppSettingsModule {}
