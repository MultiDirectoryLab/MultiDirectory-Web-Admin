import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mdStep]',
})
export class StepDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
