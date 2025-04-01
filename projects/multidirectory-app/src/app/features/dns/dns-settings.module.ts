import { NgModule } from '@angular/core';
import { DnsSettingsComponent } from './dns-settings.component';
import { DnsRuleListItemComponent } from './dns-rule-list-item/dns-rule-list-item.component';
import { CommonModule } from '@angular/common';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoModule } from '@jsverse/transloco';
import { AppFormsModule } from '@features/forms/forms.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    TranslocoModule,
    AppFormsModule,
    FontAwesomeModule,
    DnsSettingsComponent,
    DnsRuleListItemComponent,
  ],
})
export class DnsSettingsModule {}
