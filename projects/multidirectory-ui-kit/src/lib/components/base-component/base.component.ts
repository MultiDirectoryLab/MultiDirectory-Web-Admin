import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
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
  protected cdr = inject(ChangeDetectorRef);

  @Input() disabled: boolean = false;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() blur = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() focus = new EventEmitter<void>();
  unsubscribe = new Subject<boolean>();
  innerValue: any = '';

  _controlAccessor: NgControl | null = null;

  get controlAccessor(): NgControl | null {
    return this._controlAccessor;
  }

  set controlAccessor(ca: NgControl | null) {
    this._controlAccessor = ca;
    this.cdr.detectChanges();
  }

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this._onChange(v);
    }
  }

  constructor() {
    super();
  }

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
    this.blur.emit();
    this._onTouched();
    this.cdr.detectChanges();
  }

  onFocus() {
    this.focus.emit();
  }

  setFocus() {}

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  protected _onChange = (value: any) => {};

  protected _onTouched = () => {};
}
