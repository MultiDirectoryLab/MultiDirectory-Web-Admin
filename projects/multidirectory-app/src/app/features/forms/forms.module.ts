import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { PasswordConditionsModule } from '@features/ldap-browser/components/editors/change-password/password-conditions/password-conditions.module';
import { TranslocoRootModule } from '../../transloco-root.module';
import { AddPrincipalDialogComponent } from './add-principal-dialog/add-principal-dialog.component';
import { CatalogCreateComponent } from './catalog-create/catalog-create.component';
import { CatalogSelectorModule } from './catalog-selector/catalog-selector.module';
import { ComputerCreateComponent } from './computer-create/computer-create.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DnsRulesDialogComponent } from './dns-rule/dns-rule-dialog.component';
import { DnsSetupDialogComponent } from './dns-setup/dns-setup-dialog.component';
import { DnsSetupComponent } from './dns-setup/dns-setup/dns-setup.component';
import { EntitySelectorModule } from './entity-selector/entity-selector.module';
import { EntityTypeSelectorModule } from './entity-type-selector/entity-type-selector.module';
import { GroupCreateComponent } from './group-create/group-create.component';
import { ModifyDnComponent } from './modify-dn/modify-dn.component';
import { MoveEntityDialogComponent } from './move-entity/move-entity.component';
import { OuCreateComponent } from './ou-create/ou-create.component';
import { RuleCreateComponent } from './rule-create/rule-create.component';
import { SetupKerberosDialogComponent } from './setup-kerberos/setup-kerberos.component';
import { UserCreateGeneralInfoComponent } from './user-create/general-info/general-info.component';
import { UserCreatePasswordSettingsComponent } from './user-create/password-settings/password-settings.component';
import { UserCreateSummaryComponent } from './user-create/summary/summary.component';
import { UserCreateComponent } from './user-create/user-create.component';

@NgModule({
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
    CommonModule,
    FormsModule,
    ValidatorsModule,
    TranslocoRootModule,
    PasswordConditionsModule,
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
})
export class AppFormsModule {}
