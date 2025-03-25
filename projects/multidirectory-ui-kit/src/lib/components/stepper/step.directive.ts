import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';

@Directive({
  selector: '[mdStep]',
})
export class StepDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
