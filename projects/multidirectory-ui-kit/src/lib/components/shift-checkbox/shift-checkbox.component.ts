import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';

@Component({
  selector: 'md-shift-checkbox',
  templateUrl: './shift-checkbox.component.html',
  styleUrls: ['./shift-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShiftCheckboxComponent), // replace name as appropriate
      multi: true,
    },
  ],
})
export class ShiftCheckboxComponent extends BaseComponent implements OnInit {
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() click = new EventEmitter<boolean>();
  ngOnInit() {
    this.value = false;
  }

  onToggle($event?: MouseEvent) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    if (this.disabled) {
      return;
    }
    this.value = !this.checkbox.nativeElement.checked;
    this.checkbox.nativeElement.checked = !this.checkbox.nativeElement.checked;
    this.click.emit();
    this.cdr.detectChanges();
  }

  onToggleKey($event: KeyboardEvent) {
    if ($event.key == ' ') {
      $event.preventDefault();
      $event.stopPropagation();
      this.onToggle();
    }
  }
}
