import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ValidatorsModule } from '@core/validators/validators.module';
import { SessionsModule } from '@features/settings/sessions/sessions.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoModule } from '@jsverse/transloco';
import { DnsSettingsModule } from '../dns/dns-settings.module';
import { AboutComponent } from './about/about.component';
import { AppSettingsRoutingModule } from './app-settings-routes.module';
import { AppSettingsComponent } from './app-settings.component';
import { KerberosPrincipalsComponent } from './kerberos-principals/kerberos-principals.component';
import { MfIntegrationFormComponent } from './mulifactor-settings/mf-integration-form/mf-integration-form.component';
import { MultifactorSettingsComponent } from './mulifactor-settings/multifactor-settings.component';
import { MultidirectorySettingsComponent } from './multidirectory-settings/multidirectory-settings.component';
import { AppSettingsNavigationComponent } from './navigation/app-settings-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    RouterModule,
    AppSettingsRoutingModule,
    DragDropModule,
    TranslocoModule,
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
