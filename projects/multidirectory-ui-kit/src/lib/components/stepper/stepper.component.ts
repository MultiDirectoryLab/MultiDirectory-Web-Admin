import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { StepDirective } from './step.directive';

@Component({
  selector: 'md-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class StepperComponent {
  private cdr = inject(ChangeDetectorRef);

  @ContentChildren(StepDirective) steps!: QueryList<StepDirective>;
  currentIndex = 0;
  @Output() nextStep = new EventEmitter<TemplateRef<any>>();
  @Output() finish = new EventEmitter<void>();
  @Input() context!: any;

  next(count: number = 1) {
    if (this.currentIndex + count == this.steps.length) {
      this.finish.emit();
    } else {
      this.currentIndex += 1;
      this.nextStep.emit(this.steps.get(this.currentIndex)?.templateRef);
    }
    this.cdr.detectChanges();
  }

  previous(count: number = 1) {
    if (this.currentIndex - count < 0) {
      this.finish.emit();
    } else {
      this.currentIndex -= count;
    }
    this.cdr.detectChanges();
  }

  reset() {
    this.currentIndex = 0;
    this.cdr.detectChanges();
  }
}
