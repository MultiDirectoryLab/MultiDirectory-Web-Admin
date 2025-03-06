import { Directive, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mdStep]',
})
export class StepDirective {
  @Output() stepComplete = new EventEmitter<void>();
  constructor(public templateRef: TemplateRef<unknown>) {}
}
