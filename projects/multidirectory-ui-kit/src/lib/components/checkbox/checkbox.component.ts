import { Component, EventEmitter, Output, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';

@Component({
  selector: 'md-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  imports: [FormsModule],
})
export class CheckboxComponent extends BaseComponent {
  @Output() change = new EventEmitter<boolean>();
  onChange(event: Event) {
    event.stopPropagation();
    this.change.emit(this.innerValue);
  }

  onLabelClick(event: Event, checked: boolean) {
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    this.value = !checked;
    this.change.emit(this.value);
  }
}
