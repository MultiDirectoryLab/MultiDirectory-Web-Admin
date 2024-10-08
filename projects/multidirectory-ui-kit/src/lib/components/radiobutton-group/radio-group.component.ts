import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  QueryList,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';
import { RadiobuttonComponent } from '../radiobutton/radiobutton.component';

@Component({
  selector: 'md-radiogroup',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent), // replace name as appropriate
      multi: true,
    },
  ],
})
export class RadioGroupComponent extends BaseComponent {
  @Input() drawBorder = false;
  @Input() title = '';
  @Output() valueChanges = new EventEmitter<any>();
  buttons: RadiobuttonComponent[] = [];

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  override writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.cdr.detectChanges();
    }
    this.valueChanges.emit(value);
  }
}
