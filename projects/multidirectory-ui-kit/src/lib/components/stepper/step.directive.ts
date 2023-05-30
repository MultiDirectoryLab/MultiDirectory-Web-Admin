import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
    selector: '[mdStep]'
  })
  export class StepDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
  }