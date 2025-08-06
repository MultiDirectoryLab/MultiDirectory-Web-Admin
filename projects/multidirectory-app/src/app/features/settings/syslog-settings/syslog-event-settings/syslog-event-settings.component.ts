import { Component, DestroyRef, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { SyslogEvent } from '@models/api/syslog/syslog-event';
import { SyslogService } from '@services/syslog.service';
import { of, switchMap, take } from 'rxjs';
import {
  DatagridComponent,
  DropdownOption,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SyslogEventEditDialogData,
  SyslogEventEditReturnData,
} from './syslog-event-edit/syslog-event-edit.interface';
import { SyslogEventEditComponent } from './syslog-event-edit/syslog-event-edit.component';
import { DialogService } from '@components/modals/services/dialog.service';
import { TableColumn } from 'ngx-datatable-gimefork';

@Component({
  selector: 'app-syslog-event-settings',
  imports: [MultidirectoryUiKitModule, TranslocoModule, CommonModule, FormsModule],
  templateUrl: './syslog-event-settings.component.html',
  styleUrl: './syslog-event-settings.component.scss',
})
export class SyslogEventSettingsComponent implements OnInit {
  syslog = inject(SyslogService);
  destroyRef = inject(DestroyRef);
  dialog = inject(DialogService);
  grid = viewChild.required<DatagridComponent>('grid');
  selectLevelTemplate = viewChild.required<TemplateRef<any>>('selectLevelColumnTemplate');
  toggleColumnTemplate = viewChild.required<TemplateRef<any>>('toggleColumnTemplate');

  syslogEvents: SyslogEvent[] = [];
  syslogEventsColumns: TableColumn[] = [];

  pageSizes = [new DropdownOption({ title: '45', value: 45 })];
  limit = this.pageSizes[0].value;
  offset = 0;
  total = 0;
  levelOptions = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'];

  ngOnInit(): void {
    this.syslogEventsColumns = [
      { name: translate('syslog-event-settings.id-column'), prop: 'id' },
      { name: translate('syslog-event-settings.name-column'), prop: 'name' },
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
        this.syslogEvents = events
          .sort((a, b) => {
            return Number(a.id) > Number(b.id) ? 1 : -1;
          })
          .map((x) => new SyslogEvent(x));
        this.total = events.length;
      });
  }

  onRowChange(event: SyslogEvent) {
    this.syslog.updateEvent(event.id, event).subscribe();
  }

  onRowEdit() {
    this.dialog
      .open<SyslogEventEditReturnData, SyslogEventEditDialogData, SyslogEventEditComponent>({
        component: SyslogEventEditComponent,
        dialogConfig: {
          data: {
            event: new SyslogEvent(this.grid().selected[0]),
          },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((result) => {
          if (!result) {
            return of(result);
          }
          return this.syslog.updateEvent(this.grid().selected[0].id, result);
        }),
      )
      .subscribe(() => {
        this.syslog
          .getEvents()
          .pipe(take(1))
          .subscribe((events) => {
            this.syslogEvents = events
              .sort((a, b) => {
                return Number(a.id) > Number(b.id) ? 1 : -1;
              })
              .map((x) => new SyslogEvent(x));
            this.total = events.length;
          });
      });
  }
}
