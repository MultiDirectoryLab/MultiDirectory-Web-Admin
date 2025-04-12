import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';
import { DatePickerComponent, DpDatePickerModule } from 'ng2-date-picker';
import { Subject, takeUntil } from 'rxjs';
import { IdProvider } from '../../utils/id-provider';

@Component({
  selector: 'md-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
  imports: [DpDatePickerModule, FormsModule],
})
export class DatepickerComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private __ID = IdProvider.getUniqueId('base');
  private unsubscribe = new Subject<boolean>();
  @ViewChild('datePicker') private datePicker!: DatePickerComponent;
  protected cdr = inject(ChangeDetectorRef);
  @Input() disabled: boolean = false;

  // DOM Component -> Outside
  private _date? = moment();

  get date(): moment.Moment | undefined {
    return this._date;
  }

  ngAfterViewInit(): void {
    this.datePicker.onSelect.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      const m = moment((x.date as any).toDate());
      this._onChange(this.fileTimeFromDate(m));
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  // API -> DOM component
  writeValue(value: any): void {
    if (!Number(value)) {
      this.clearDate();
      return;
    }
    this._date = this.fileTimeToDate(value);
  }

  clearDate() {
    this._date = undefined;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  onBlur() {
    this._onTouched();
    this.cdr.detectChanges();
  }

  onFocus() {}

  protected _onChange = (value: any) => {};

  protected _onTouched = () => {};

  private fileTimeToDate(filetime: number): moment.Moment {
    const date = new Date(filetime / 10000 - 11644473600000);
    return moment(date.toJSON());
  }

  private fileTimeFromDate(date: moment.Moment): number {
    if (!date) {
      return 0;
    }
    return date.toDate().getTime() * 1e4 + 116444736e9;
  }
}
