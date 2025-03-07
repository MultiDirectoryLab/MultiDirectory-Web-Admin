import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';

@Directive({
  selector: '[mdStep]',
})
export class StepDirective {
  @Input() stepComplete: () => Observable<void | null> = () => of(null);
  constructor(public templateRef: TemplateRef<unknown>) {}
}
