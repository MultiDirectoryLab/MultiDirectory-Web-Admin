import { NgModule } from '@angular/core';
import { CatalogSelectorModule } from './catalog-selector/catalog-selector.module';
import { EntityTypeSelectorModule } from './entity-type-selector/entity-type-selector.module';
import { GroupCreateComponent } from './group-create/group-create.component';
import { OuCreateComponent } from './ou-create/ou-create.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { EntitySelectorModule } from './entity-selector/entity-selector.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { UserCreateSummaryComponent } from './user-create/summary/summary.component';
import { UserCreatePasswordSettingsComponent } from './user-create/password-settings/password-settings.component';
import { UserCreateGeneralInfoComponent } from './user-create/general-info/general-info.component';
import { ComputerCreateComponent } from './computer-create/computer-create.component';
import { TranslocoRootModule } from '../../transloco-root.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ModifyDnComponent } from './modify-dn/modify-dn.component';
import { MoveEntityDialogComponent } from './move-entity/move-entity.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CatalogCreateComponent } from './catalog-create/catalog-create.component';
import { PasswordConditionsModule } from '@features/ldap-browser/components/editors/change-password/password-conditions/password-conditions.module';
import { AddPrincipalDialogComponent } from './add-principal-dialog/add-principal-dialog.component';
import { SetupKerberosDialogComponent } from './setup-kerberos/setup-kerberos.component';
import { DnsRulesDialogComponent } from './dns-rule/dns-rule-dialog.component';
import { DnsSetupDialogComponent } from './dns-setup/dns-setup-dialog.component';
import { DnsSetupComponent } from './dns-setup/dns-setup/dns-setup.component';
import { RuleCreateComponent } from './rule-create/rule-create.component';

@NgModule({
  declarations: [
    GroupCreateComponent,
    OuCreateComponent,
    RuleCreateComponent,
    UserCreateComponent,
    UserCreateSummaryComponent,
    UserCreatePasswordSettingsComponent,
    UserCreateGeneralInfoComponent,
    ComputerCreateComponent,
    ModifyDnComponent,
    MoveEntityDialogComponent,
    ConfirmDialogComponent,
    CatalogCreateComponent,
    AddPrincipalDialogComponent,
    SetupKerberosDialogComponent,
    DnsRulesDialogComponent,
    DnsSetupDialogComponent,
    DnsSetupComponent,
  ],
  exports: [
    GroupCreateComponent,
    OuCreateComponent,
    RuleCreateComponent,
    UserCreateComponent,
    EntitySelectorModule,
    ComputerCreateComponent,
    ModifyDnComponent,
    MoveEntityDialogComponent,
    ConfirmDialogComponent,
    CatalogCreateComponent,
    AddPrincipalDialogComponent,
    SetupKerberosDialogComponent,
    DnsRulesDialogComponent,
    DnsSetupDialogComponent,
    DnsSetupComponent,
  ],
  imports: [
    CatalogSelectorModule,
    EntityTypeSelectorModule,
    EntitySelectorModule,
    MultidirectoryUiKitModule,
    CommonModule,
    FormsModule,
    ValidatorsModule,
    TranslocoRootModule,
    PasswordConditionsModule,
  ],
})
export class AppFormsModule {}
