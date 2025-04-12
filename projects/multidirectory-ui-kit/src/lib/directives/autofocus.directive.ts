import { AfterViewInit, Directive, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../components/base-component/base.component';

@Directive({
  selector: '[appAutofocus]',
  providers: [
    {
      provide: AutofocusDirective,
      useExisting: forwardRef(() => AutofocusDirective),
    },
  ],
})
export class AutofocusDirective implements AfterViewInit {
  private accessor = inject(NG_VALUE_ACCESSOR);

  ngAfterViewInit(): void {
    setTimeout(() => (this.accessor?.[0] as BaseComponent)?.setFocus(), 5);
  }
}
