import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SyslogEvent } from '@models/api/syslog/syslog-event';
import { SyslogService } from '@services/syslog.service';
import { DatagridComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SelectionType, TableColumn } from 'ngx-datatable-gimefork';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, switchMap, take } from 'rxjs';
import { SyslogEventEditComponent } from './syslog-event-edit/syslog-event-edit.component';
import { SyslogEventEditDialogData, SyslogEventEditReturnData } from './syslog-event-edit/syslog-event-edit.interface';

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
  selected: SyslogEvent[] = [];

  private grid = viewChild.required<DatagridComponent>('grid');
  private selectLevelTemplate = viewChild.required<TemplateRef<any>>('selectLevelColumnTemplate');
  private toggleColumnTemplate = viewChild.required<TemplateRef<any>>('toggleColumnTemplate');
  private toggleHeaderTemplate = viewChild.required<TemplateRef<any>>('toggleHeaderTemplate');

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
        headerCheckboxable: true,
        checkboxable: true,
        headerTemplate: this.toggleHeaderTemplate(),
        cellTemplate: this.toggleColumnTemplate(),
      },
    ];
    this.loadEvents();
  }
  checkAllCheckbox = false;

  selectionChanged(event: SyslogEvent[]) {
    if (event.length === this.limit || event.length === 0) {
      this.checkAllCheckbox = !this.checkAllCheckbox;
    }
    const newEnabledItems: SyslogEvent[] = this.symmetricDifferenceById(event, this.selected);
    newEnabledItems.forEach((row) => {
      this.syslog.updateEvent(row.id, row).subscribe();
    });

    this.refreshAllEvents(newEnabledItems);
    this.selected = [...event];
  }

  refreshAllEvents(newEnabledItems: SyslogEvent[]) {
    let newAllEvents: { [key: string]: SyslogEvent } = Object.fromEntries(newEnabledItems.map((item) => [item.id, new SyslogEvent(item)]));
    this.allEvents = this.allEvents.map((item): SyslogEvent => {
      if (!newAllEvents[item.id]) {
        return item;
      }
      return newAllEvents[item.id];
    });
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
    this.calcPageRows();
  }

  private loadEvents() {
    this.syslog.getEvents().subscribe((events) => {
      this.allEvents = events.sort((a, b) => (Number(a.id) > Number(b.id) ? 1 : -1)).map((x) => new SyslogEvent(x));

      this.calcPageRows();

      this.selected = this.syslogEvents.filter((item) => item.is_enabled);
    });
  }

  calcPageRows(): void {
    const start = this.offset;
    const end = start + this.limit;

    this.syslogEvents = this.allEvents.slice(start, end);
    this.total = this.allEvents.length;
    this.selected = this.syslogEvents.filter((item) => item.is_enabled);
    this.grid()._selected = this.syslogEvents.filter((item) => item.is_enabled);
  }

  /**
   * Поиск измененных строк с проставлением значения для параметра is_enabled
   **/
  symmetricDifferenceById<T, K extends keyof T>(arr1: T[], arr2: T[], idKey: K = 'id' as K): T[] {
    const map1 = new Map<T[K], T>(arr1.map((item) => [item[idKey], item]));
    const map2 = new Map<T[K], T>(arr2.map((item) => [item[idKey], item]));

    const result: T[] = [];

    for (const [id, item] of map1) {
      if (!map2.has(id)) {
        result.push({ ...item, is_enabled: true });
      }
    }

    for (const [id, item] of map2) {
      if (!map1.has(id)) {
        result.push({ ...item, is_enabled: false });
      }
    }

    return result;
  }

  protected readonly SelectionType = SelectionType;
}
