import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from '../base-component/base.component';
import { ErrorLabelComponent } from '../base-component/error-label/error-label.component';
import { CommonModule } from '@angular/common';

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
  imports: [FormsModule, FaIconComponent, ErrorLabelComponent],
})
export class TextboxComponent extends BaseComponent {
  protected override cdr = inject(ChangeDetectorRef);

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Input() label = '';
  @Input() password = false;
  @Input() allowPasswordView = true;
  @Input() autocomplete = false;
  @Input() autofocus = false;
  @Input() placeholder = '';
  passwordVisible = false;
  faEye = faEye;

  constructor() {
    super();
  }

  override setFocus() {
    this.input.nativeElement.focus();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
