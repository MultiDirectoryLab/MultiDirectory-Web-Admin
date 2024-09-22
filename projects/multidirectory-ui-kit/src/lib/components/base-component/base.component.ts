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
import { BaseControlComponent } from './control.component';

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent extends BaseControlComponent implements ControlValueAccessor, OnDestroy {
  @Input() disabled: boolean = false;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() blur = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() focus = new EventEmitter<void>();
  unsubscribe = new Subject<boolean>();
  _controlAccessor?: NgControl;
  get controlAccessor(): NgControl {
    return this._controlAccessor!;
  }
  set controlAccessor(ca: NgControl) {
    this._controlAccessor = ca;
    this.cdr.detectChanges();
  }
  constructor(protected cdr: ChangeDetectorRef) {
    super();
  }

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

  onFocus() {
    this.focus.next();
  }

  setFocus() {}

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
}
