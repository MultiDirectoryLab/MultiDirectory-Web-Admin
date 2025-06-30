import { Component, DestroyRef, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { SyslogEvent } from '@models/api/syslog/syslog-event';
import { SyslogService } from '@services/syslog.service';
import { take } from 'rxjs';
import { DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-syslog-event-settings',
  imports: [MultidirectoryUiKitModule, TranslocoModule, CommonModule, FormsModule],
  templateUrl: './syslog-event-settings.component.html',
  styleUrl: './syslog-event-settings.component.scss',
})
export class SyslogEventSettingsComponent implements OnInit {
  syslog = inject(SyslogService);
  destroyRef = inject(DestroyRef);
  selectLevelTemplate = viewChild.required<TemplateRef<any>>('selectLevelColumnTemplate');
  toggleColumnTemplate = viewChild.required<TemplateRef<any>>('toggleColumnTemplate');

  syslogEvents: SyslogEvent[] = [];
  syslogEventsColumns: TableColumn[] = [];

  pageSizes = [new DropdownOption({ title: '45', value: 45 })];
  limit = this.pageSizes[0].value;
  offset = 0;
  total = 0;
  levelOptions = ['info', 'warning', 'error', 'verbose', 'debug'];

  ngOnInit(): void {
    this.syslogEventsColumns = [
      { name: translate('syslog-event-settings.id-column'), prop: 'id' },
      { name: translate('syslog-event-settings.name-column'), prop: 'name' },
      { name: translate('syslog-event-settings.description-column'), prop: 'description' },
      {
        name: translate('syslog-event-settings.level-column'),
        cellTemplate: this.selectLevelTemplate(),
      },
      {
        name: translate('syslog-event-settings.toggle-column'),
        cellTemplate: this.toggleColumnTemplate(),
      },
    ];
    this.syslog
      .getEvents()
      .pipe(take(1))
      .subscribe((events) => {
        this.syslogEvents = events;
        this.total = events.length;
      });
  }
}
