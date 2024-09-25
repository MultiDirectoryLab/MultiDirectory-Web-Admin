import { NgModule } from '@angular/core';
import { DnsSettingsComponent } from './dns-settings.component';
import { DnsRuleListItemComponent } from './dns-rule-list-item/dns-rule-list-item.component';
import { CommonModule } from '@angular/common';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  declarations: [DnsSettingsComponent, DnsRuleListItemComponent],
  imports: [CommonModule, MultidirectoryUiKitModule, TranslocoModule],
})
export class DnsSettingsModule {}
