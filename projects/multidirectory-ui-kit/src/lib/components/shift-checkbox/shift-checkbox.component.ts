import { Component, ElementRef, OnInit, ViewChild, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseComponent } from "../base-component/base.component";

@Component({
    selector: 'md-shift-checkbox',
    templateUrl: './shift-checkbox.component.html',
    styleUrls: ['./shift-checkbox.component.scss'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => ShiftCheckboxComponent),  // replace name as appropriate
          multi: true
        }
    ]
})
export class ShiftCheckboxComponent extends BaseComponent implements OnInit {
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;

  override ngOnInit() {
    super.ngOnInit();
    this.value = false;
  }

  onToggle() {
    this.value = !this.checkbox.nativeElement.checked;
    this.checkbox.nativeElement.checked = !this.checkbox.nativeElement.checked;
    this.cdr.detectChanges();
  }

  onToggleKey($event: KeyboardEvent) {
    if($event.key == ' ') {
      $event.preventDefault();
      $event.stopPropagation();
      this.onToggle();
    }
  }
}