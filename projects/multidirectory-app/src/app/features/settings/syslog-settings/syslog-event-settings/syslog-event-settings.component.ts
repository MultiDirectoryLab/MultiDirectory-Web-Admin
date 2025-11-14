import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SyslogEvent } from '@models/api/syslog/syslog-event';
import { SyslogService } from '@services/syslog.service';
import { DatagridComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, switchMap, take } from 'rxjs';
import { SyslogEventEditComponent } from './syslog-event-edit/syslog-event-edit.component';
import {
  SyslogEventEditDialogData,
  SyslogEventEditReturnData,
} from './syslog-event-edit/syslog-event-edit.interface';

@Component({
  selector: 'app-syslog-event-settings',
  imports: [MultidirectoryUiKitModule, TranslocoModule, CommonModule, FormsModule],
  templateUrl: './syslog-event-settings.component.html',
  styleUrl: './syslog-event-settings.component.scss',
})
export class SyslogEventSettingsComponent implements OnInit {
  syslogEvents: SyslogEvent[] = [];
  syslogEventsColumns: TableColumn[] = [];
  limit = 20;
  offset = 0;
  total = 0;
  levelOptions = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'];

  private allEvents: SyslogEvent[] = [];

  private grid = viewChild.required<DatagridComponent>('grid');
  private selectLevelTemplate = viewChild.required<TemplateRef<any>>('selectLevelColumnTemplate');
  private toggleColumnTemplate = viewChild.required<TemplateRef<any>>('toggleColumnTemplate');

  private readonly syslog = inject(SyslogService);
  private readonly toastr = inject(ToastrService);
  private readonly dialog = inject(DialogService);

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
    this.loadEvents();
  }

  protected onRowChange(event: SyslogEvent) {
    this.syslog.updateEvent(event.id, event).subscribe();
  }

  protected onRowEdit() {
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
        this.loadEvents();
      });
  }

  protected onPaginationChange(): void {
    const sortedEvents = this.allEvents
      .sort((a, b) => (Number(a.id) > Number(b.id) ? 1 : -1))
      .map((x) => new SyslogEvent(x));
    const start = this.offset;
    const end = start + this.limit;

    this.syslogEvents = sortedEvents.slice(start, end);
    this.total = sortedEvents.length;
  }

  private loadEvents() {
    this.syslog
      .getEvents()
      .pipe(
        catchError((err) => {
          this.toastr.error(translate('syslog-event-settings.load-events-error'));
          throw err;
        }),
      )
      .subscribe((events) => {
        const sortedEvents = events
          .sort((a, b) => (Number(a.id) > Number(b.id) ? 1 : -1))
          .map((x) => new SyslogEvent(x));
        const start = this.offset;
        const end = start + this.limit;

        this.allEvents = sortedEvents;
        this.syslogEvents = sortedEvents.slice(start, end);
        this.total = events.length;
      });
  }
}
