import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoModule } from '@jsverse/transloco';
import { DnsRuleListItemComponent } from './dns-rule-list-item/dns-rule-list-item.component';
import { DnsSettingsComponent } from './dns-settings.component';

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    FontAwesomeModule,
    DnsSettingsComponent,
    DnsRuleListItemComponent,
  ],
})
export class DnsSettingsModule {}
