import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';
import { ErrorLabelComponent } from '../base-component/error-label/error-label.component';
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
  imports: [NgTemplateOutlet, ErrorLabelComponent],
})
export class RadioGroupComponent extends BaseComponent {
  protected override cdr = inject(ChangeDetectorRef);

  @Input() drawBorder = false;
  @Input() title = '';
  @Output() valueChanges = new EventEmitter<any>();
  buttons: RadiobuttonComponent[] = [];

  constructor() {
    super();
  }

  override writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.cdr.detectChanges();
    }
    this.valueChanges.emit(value);
  }
}
