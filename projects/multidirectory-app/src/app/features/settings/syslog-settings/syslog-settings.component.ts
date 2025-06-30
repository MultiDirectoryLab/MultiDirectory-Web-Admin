import { Component } from '@angular/core';
import { SyslogEventSettingsComponent } from './syslog-event-settings/syslog-event-settings.component';
import { SyslogConnectionsSettingsComponent } from './syslog-connections-settings/syslog-connections-settings.component';
import { MuiTabDirective, MuiTabsComponent } from '@mflab/mui-kit';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-syslog-settings',
  imports: [
    SyslogEventSettingsComponent,
    SyslogConnectionsSettingsComponent,
    MuiTabsComponent,
    MuiTabDirective,
    MultidirectoryUiKitModule,
    TranslocoModule,
  ],
  templateUrl: './syslog-settings.component.html',
  styleUrl: './syslog-settings.component.scss',
})
export class SyslogSettingsComponent {}
