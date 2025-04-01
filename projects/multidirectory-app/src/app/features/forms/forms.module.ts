import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserCreateSummaryComponent } from './user-create/summary/summary.component';
import { UserCreatePasswordSettingsComponent } from './user-create/password-settings/password-settings.component';
import { UserCreateGeneralInfoComponent } from './user-create/general-info/general-info.component';
import { TranslocoRootModule } from '../../transloco-root.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SetupKerberosDialogComponent } from './setup-kerberos/setup-kerberos.component';
import { DnsRulesDialogComponent } from './dns-rule/dns-rule-dialog.component';
import { DnsSetupDialogComponent } from './dns-setup/dns-setup-dialog.component';
import { DnsSetupComponent } from './dns-setup/dns-setup/dns-setup.component';

@NgModule({
  exports: [DnsRulesDialogComponent, DnsSetupDialogComponent, DnsSetupComponent],
  imports: [
    MultidirectoryUiKitModule,
    CommonModule,
    FormsModule,
    TranslocoRootModule,
    SetupKerberosDialogComponent,
    UserCreateGeneralInfoComponent,
    UserCreatePasswordSettingsComponent,
    UserCreateSummaryComponent,
    DnsRulesDialogComponent,
    DnsSetupDialogComponent,
    DnsSetupComponent,
  ],
})
export class AppFormsModule {}
