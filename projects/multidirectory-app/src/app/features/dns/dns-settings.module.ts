import { NgModule } from '@angular/core';
import { DnsSettingsComponent } from './dns-settings.component';
import { DnsRuleListItemComponent } from './dns-rule-list-item/dns-rule-list-item.component';
import { CommonModule } from '@angular/common';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@NgModule({
  declarations: [DnsSettingsComponent, DnsRuleListItemComponent],
  imports: [CommonModule, MultidirectoryUiKitModule],
})
export class DnsSettingsModule {}
