import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { PasswordConditionsModule } from '@features/ldap-browser/components/editors/change-password/password-conditions/password-conditions.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedComponentsModule } from '../../components/app-layout/shared/shared.module';
import { TranslocoRootModule } from '../../transloco-root.module';
import { AdminSettingsSecondComponent } from './admin-settings-second/admin-settings-second.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { DnsSetupSettingsComponent } from './dns-setup-settings/dns-setup-settings.component';
import { DomainSettingsComponent } from './domain-setttings/domain-settings.component';
import { KerberosSettingsComponent } from './kerberos-settings/kerberos-settings.component';
import { SetupComponent } from './setup/setup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslocoRootModule,
    ValidatorsModule,
    PasswordConditionsModule,
    SharedComponentsModule,
    FontAwesomeModule,
    AdminSettingsComponent,
    AdminSettingsSecondComponent,
    DomainSettingsComponent,
    KerberosSettingsComponent,
    DnsSetupSettingsComponent,
    SetupComponent,
  ],
})
export class SetupModule {}
