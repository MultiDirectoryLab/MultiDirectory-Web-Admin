import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  forwardRef,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BaseComponent } from '../base-component/base.component';

export const MD_FORM = new InjectionToken<MdFormComponent>('MDFORM');

@Component({
  selector: 'md-form',
  styleUrls: ['./form.component.scss'],
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MD_FORM,
      useExisting: forwardRef(() => MdFormComponent),
      multi: true,
    },
  ],
})
export class MdFormComponent implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);

  @ContentChildren(NgControl, { descendants: true }) inputs!: QueryList<NgControl>;
  @ContentChildren(NG_VALUE_ACCESSOR, { descendants: true })
  valueAccessors!: QueryList<BaseComponent>;
  @Input() autocomplete = false;
  inputValidators: Observable<string>[] = [];
  unsubscribe = new Subject<void>();
  unsubscribeValidators = new Subject<void>();

  private _valid = new BehaviorSubject(false);
  get valid() {
    return this._valid.value;
  }

  get onValidChanges() {
    return this._valid.asObservable();
  }

  ngAfterViewInit(): void {
    this.updateValueAccessors();
    this.updateValidators();

    this.valueAccessors.changes.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.updateValueAccessors();
    });

    this.inputs.changes.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.unsubscribeValidators.next();
      this.updateValidators();
    });
  }

  updateValueAccessors() {
    this.valueAccessors.forEach((va) => {
      const input = this.inputs.find((x) => x.valueAccessor == va);
      if (input) {
        va.controlAccessor = input;
        if (input.validator) {
          input.validator(input.control!);
        }
      }
    });
    this.cdr.detectChanges();
  }

  updateValidators() {
    const arr = this.inputs.toArray().map((x) => x.statusChanges!);
    combineLatest(arr)
      .pipe(takeUntil(this.unsubscribeValidators))
      .subscribe((va) => {
        return this._valid.next(va.every((x: string) => x == 'VALID' || x == 'DISABLED'));
      });

    this.inputs.forEach((x) => {
      x.control?.updateValueAndValidity({
        onlySelf: true,
        emitEvent: true,
      });
    });
  }

  validate(requireTouched = false) {
    this.inputs.forEach((x) => {
      if (!x.control?.touched && !requireTouched) {
        x.control?.markAsTouched();
      }
      if (x.control?.dirty) {
        x.control?.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();

    this.unsubscribeValidators.next();
    this.unsubscribeValidators.complete();
  }
}
