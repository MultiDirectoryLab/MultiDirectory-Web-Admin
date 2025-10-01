import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, fromEvent, merge, take } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from '../base-component/base.component';
import { ErrorLabelComponent } from '../base-component/error-label/error-label.component';

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
export class TextboxComponent extends BaseComponent implements AfterViewInit {
  protected override cdr = inject(ChangeDetectorRef);

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Input() label = '';
  @Input() password = false;
  @Input() allowPasswordView = true;
  @Input() autocomplete = false;
  @Input() autofocus = false;
  @Input() placeholder = '';
  @Output() autofilled = new EventEmitter<boolean>();
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

  ngAfterViewInit(): void {
    this.detectAutocomplete();
  }

  detectAutocomplete() {
    //use detection method fron detect-autofill library
    const animationstartAction = fromEvent<AnimationEvent>(document, 'animationstart').pipe(
      filter((event: AnimationEvent) => event.animationName.endsWith('onautofillstart')),
    );
    const inputAction = fromEvent<InputEvent>(document, 'input').pipe(
      filter(
        (event: InputEvent) => 'insertReplacementText' === event.inputType || !('data' in event),
      ),
    );
    merge(animationstartAction, inputAction)
      .pipe(take(1))
      .subscribe(() => {
        this.autofilled.emit(true);
      });
  }
}
