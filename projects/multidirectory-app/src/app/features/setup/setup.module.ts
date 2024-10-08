import { NgModule } from '@angular/core';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminSettingsSecondComponent } from './admin-settings-second/admin-settings-second.component';
import { DomainSettingsComponent } from './domain-setttings/domain-settings.component';
import { SetupComponent } from './setup/setup.component';
import { CommonModule } from '@angular/common';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule } from '@angular/forms';
import { SetupRoutingModule } from './setup-routing.module';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoRootModule } from '../../transloco-root.module';
import { PasswordConditionsModule } from '@features/ldap-browser/components/editors/change-password/password-conditions/password-conditions.module';
import { SharedComponentsModule } from '../../components/app-layout/shared/shared.module';
import { KerberosSettingsComponent } from './kerberos-settings/kerberos-settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppFormsModule } from '@features/forms/forms.module';
import { DnsSetupSettingsComponent } from './dns-setup-settings/dns-setup-settings.component';

@NgModule({
  declarations: [
    AdminSettingsComponent,
    AdminSettingsSecondComponent,
    DomainSettingsComponent,
    KerberosSettingsComponent,
    DnsSetupSettingsComponent,
    SetupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MultidirectoryUiKitModule,
    TranslocoRootModule,
    ValidatorsModule,
    SetupRoutingModule,
    PasswordConditionsModule,
    SharedComponentsModule,
    FontAwesomeModule,
    AppFormsModule,
  ],
})
export class SetupModule {}
