import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base-component/base.component';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'md-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextboxComponent),
      multi: true,
    },
  ],
})
export class TextboxComponent extends BaseComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Input() label: string = '';
  @Input() password: boolean = false;
  @Input() autocomplete: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() placeholder = '';
  passwordVisible = false;
  faEye = faEye;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  override setFocus() {
    this.input.nativeElement.focus();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
