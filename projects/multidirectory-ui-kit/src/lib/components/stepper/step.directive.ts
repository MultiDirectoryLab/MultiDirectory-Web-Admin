import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mdStep]',
})
export class StepDirective {
  templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
