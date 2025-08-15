import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import BitSet from 'bitset';
import { fromEvent, take } from 'rxjs';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { LogonTimeEditorDialogData } from '@components/modals/interfaces/logon-time-editor-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';

export class LogonMapDay {
  id: number | null = null;
  title = '';

  constructor(obj: Partial<LogonMapDay>) {
    Object.assign(this, obj);
  }
}

export class LogonDayState {
  day = -1;
  hour = -1;
  allowed = 0;

  constructor(obj: Partial<LogonDayState>) {
    Object.assign(this, obj);
  }
}

@Component({
  selector: 'app-logon-time-editor-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    TranslocoPipe,
    NgClass,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './logon-time-editor-dialog.component.html',
  styleUrl: './logon-time-editor-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogonTimeEditorDialogComponent implements OnInit {
  @ViewChild('logonMap', { static: true }) logonMap!: ElementRef<HTMLDivElement>;
  username = '';
  daysOfWeek: LogonMapDay[] = [
    { id: null, title: translate('logon-time-editor.every') },
    { id: 0, title: translate('logon-time-editor.monday') },
    { id: 1, title: translate('logon-time-editor.tuesday') },
    { id: 2, title: translate('logon-time-editor.wednesday') },
    { id: 3, title: translate('logon-time-editor.thursday') },
    { id: 4, title: translate('logon-time-editor.friday') },
    { id: 5, title: translate('logon-time-editor.saturday') },
    { id: 6, title: translate('logon-time-editor.sunday') },
  ];
  hours = Array.from(Array(24).keys());
  bitValues = new BitSet().setRange(0, 24 * 7, 1);
  selectDayStarted = -1;
  selectHourStarted = -1;
  selectDayCurrent = -1;
  selectHourCurrent = -1;
  selectionInProgress = false;
  currentSelectionStatus: boolean | null = null;
  selectedDaysState: LogonDayState[] = [];
  fromDescription: string[] = [
    translate('logon-time-editor.from-monday'),
    translate('logon-time-editor.from-tuesday'),
    translate('logon-time-editor.from-wednesday'),
    translate('logon-time-editor.from-thursday'),
    translate('logon-time-editor.from-friday'),
    translate('logon-time-editor.from-saturday'),
    translate('logon-time-editor.from-sunday'),
    translate('logon-time-editor.to-monday'),
    translate('logon-time-editor.to-tuesday'),
    translate('logon-time-editor.to-wednesday'),
    translate('logon-time-editor.to-thursday'),
    translate('logon-time-editor.to-friday'),
    translate('logon-time-editor.to-saturday'),
    translate('logon-time-editor.to-sunday'),
  ];

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);
  private dialogData: LogonTimeEditorDialogData = inject(DIALOG_DATA);

  private _selectionAllowance: number | null = null;

  get selectionAllowance(): number | null {
    return this._selectionAllowance;
  }

  @Input() set selectionAllowance(state: number | null) {
    this.selectedDaysState.forEach((x) => {
      this.setDayBit(x.day, x.hour, state);
    });
    this.selectDayStarted = -1;
    this.selectHourStarted = -1;
    this.selectDayCurrent = -1;
    this.selectHourCurrent = -1;
    this._selectionAllowance = null;
    this.selectedDaysState = [];
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    if (this.dialogData.logonHours) {
      this.bitValues = BitSet.fromBinaryString(this.dialogData.logonHours);
    }
  }

  getDayBit(dayId: number | null, hour: number): number {
    if (dayId == null) {
      return 0;
    }
    const index = 24 * dayId + hour;
    return this.bitValues.get(index);
  }

  setDayBit(dayId: number | null, hour: number, value: number | null = null) {
    if (dayId == null) {
      return;
    }
    const index = 24 * dayId + hour;
    if (!value) {
      this.bitValues.set(index, this.bitValues.get(index) == 1 ? 0 : 1);
    } else {
      this.bitValues.set(index, value);
    }
    this.cdr.detectChanges();
  }

  onDaySelect($event: MouseEvent, day: LogonMapDay) {
    $event.preventDefault();
    $event.stopPropagation();
    if (day.id == null) {
      this.onDaySelectAll($event);
      return;
    }
    this.selectDayStarted = day.id ?? -1;
    this.selectDayCurrent = day.id ?? -1;
    this.selectHourStarted = 0;
    this.selectHourCurrent = this.hours.length;
    this.finishSelection();
  }

  onDaySelectAll($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.selectDayStarted = 0;
    this.selectDayCurrent = this.daysOfWeek[7].id ?? -1;
    this.selectHourStarted = 0;
    this.selectHourCurrent = this.hours.length - 1;
    this.finishSelection();
  }

  onHoursSelect($event: MouseEvent, hours: number) {
    this.selectDayStarted = 0;
    this.selectDayCurrent = this.daysOfWeek[7].id ?? -1;
    this.selectHourStarted = hours;
    this.selectHourCurrent = hours;
    this.finishSelection();
  }

  onSelectStarted($event: MouseEvent, day: LogonMapDay, hour: number) {
    this.selectDayStarted = day.id ?? -1;
    this.selectHourStarted = hour;
    this.selectHourCurrent = -1;
    this.selectDayCurrent = -1;
    this.selectionInProgress = true;
    fromEvent(document, 'mouseup')
      .pipe(take(1))
      .subscribe(() => {
        this.finishSelection();
      });
  }

  finishSelection() {
    this.selectionInProgress = false;
    this.cdr.detectChanges();
    const selectedElements = this.logonMap.nativeElement.querySelectorAll('.logon-selected');
    this.selectedDaysState = Array.from(selectedElements).map((x) => {
      const day = Number(x.getAttribute('data-day'));
      const hour = Number(x.getAttribute('data-hour'));
      return {
        day: day,
        hour: hour,
        allowed: this.getDayBit(day, hour),
      };
    });
    const allAllowed = this.selectedDaysState.every((x) => x.allowed);
    const allForbidden = !this.selectedDaysState.some((x) => x.allowed);
    this._selectionAllowance = allAllowed ? 1 : allForbidden ? 0 : null;
    this.cdr.detectChanges();
  }

  onSelectMouseEnter($event: Event, day: LogonMapDay, hour: number) {
    if (this.selectionInProgress) {
      this.selectDayCurrent = day.id ?? -1;
      this.selectHourCurrent = hour;
      this.cdr.detectChanges();
    }
  }

  isInsideSelection(day: LogonMapDay, hour: number) {
    if (
      day.id == null ||
      day.id < 0 ||
      this.selectDayCurrent < 0 ||
      this.selectDayStarted < 0 ||
      this.selectHourCurrent < 0 ||
      this.selectHourStarted < 0
    ) {
      return false;
    }
    const dayId = day.id ?? -1;
    return (
      dayId >= Math.min(this.selectDayCurrent, this.selectDayStarted) &&
      dayId <= Math.max(this.selectDayCurrent, this.selectDayStarted) &&
      hour >= Math.min(this.selectHourCurrent, this.selectHourStarted) &&
      hour <= Math.max(this.selectHourCurrent, this.selectHourStarted)
    );
  }

  selectSingle(day: LogonMapDay, hour: number) {
    this.selectDayCurrent = this.selectDayStarted = day.id ?? -1;
    this.selectHourCurrent = this.selectHourStarted = hour;
    this.finishSelection();
  }

  isSelectionRowStart(day: LogonMapDay, hour: number) {
    if (!day.id || day.id < 0 || hour < 0) {
      return false;
    }
    return (
      day.id == Math.min(this.selectDayCurrent, this.selectDayStarted) &&
      hour >= Math.min(this.selectHourCurrent, this.selectHourStarted) &&
      hour <= Math.max(this.selectHourCurrent, this.selectHourStarted)
    );
  }

  isSelectionColumnStart(day: LogonMapDay, hour: number) {
    if (!day.id || day.id < 0 || hour < 0) {
      return false;
    }
    const dayId = day.id;
    return (
      hour == Math.min(this.selectHourCurrent, this.selectHourStarted) &&
      dayId >= Math.min(this.selectDayCurrent, this.selectDayStarted) &&
      dayId <= Math.max(this.selectDayCurrent, this.selectDayStarted)
    );
  }

  isSelectionColumnEnd(day: LogonMapDay, hour: number) {
    if (!day.id || day.id < 0 || hour < 0) {
      return false;
    }
    const dayId = day.id;
    return (
      hour == Math.max(this.selectHourCurrent, this.selectHourStarted) &&
      dayId >= Math.min(this.selectDayCurrent, this.selectDayStarted) &&
      dayId <= Math.max(this.selectDayCurrent, this.selectDayStarted)
    );
  }

  isSelectionRowEnd(day: LogonMapDay, hour: number) {
    if (!day.id || day.id < 0 || hour < 0) {
      return false;
    }
    return (
      day.id == Math.max(this.selectDayCurrent, this.selectDayStarted) &&
      hour >= Math.min(this.selectHourCurrent, this.selectHourStarted) &&
      hour <= Math.max(this.selectHourCurrent, this.selectHourStarted)
    );
  }

  getSelectionDescription() {
    if (
      this.selectDayCurrent < 0 ||
      this.selectDayStarted < 0 ||
      this.selectHourCurrent < 0 ||
      this.selectHourStarted < 0
    ) {
      return '';
    }
    const from = this.fromDescription[Math.min(this.selectDayStarted, this.selectDayCurrent)];
    const to = this.fromDescription[Math.max(this.selectDayStarted, this.selectDayCurrent) + 7];
    return `${from} ${to}, ${translate('logon-time-editor.starts-from')} ${Math.min(this.selectHourStarted, this.selectHourCurrent)}:00 ${translate('logon-time-editor.finish-to')} ${Math.max(this.selectHourStarted, this.selectHourCurrent) + 1}:00`;
  }

  close() {
    this.dialogService.close(this.dialogRef, null);
  }

  finish() {
    this.dialogService.close(this.dialogRef, this.bitValues.toString(2));
  }
}
