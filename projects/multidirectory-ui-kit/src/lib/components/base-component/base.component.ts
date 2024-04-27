import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { IdProvider } from '../../utils/id-provider';

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit, ControlValueAccessor, OnDestroy {
  __ID = IdProvider.getUniqueId('base');
  @Input() disabled: boolean = false;
  @Output() blur = new EventEmitter<void>();
  unsubscribe = new Subject<boolean>();
  _controlAccessor?: NgControl;
  get controlAccessor(): NgControl {
    return this._controlAccessor!;
  }
  set controlAccessor(ca: NgControl) {
    this._controlAccessor = ca;
    this.cdr.detectChanges();
  }
  constructor(protected cdr: ChangeDetectorRef) {}

  innerValue: any = '';

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this._onChange(v);
    }
  }

  protected _onChange = (value: any) => {};
  protected _onTouched = () => {};

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.cdr.detectChanges();
    }
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
    this.blur.next();
    this._onTouched();
    this.cdr.detectChanges();
  }

  focus() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
}
