import { NgModule } from '@angular/core';
import { DnsSettingsComponent } from './dns-settings.component';
import { MultidirectoryUiKitModule } from '../../../../../multidirectory-ui-kit/src/lib/multidirectory-ui-kit.module';
import { CommonModule } from '@angular/common';
import { DnsRuleListItemComponent } from './dns-rule-list-item/dns-rule-list-item.component';

@NgModule({
  declarations: [DnsSettingsComponent, DnsRuleListItemComponent],
  imports: [CommonModule, MultidirectoryUiKitModule],
})
export class DnsSettingsModule {}
