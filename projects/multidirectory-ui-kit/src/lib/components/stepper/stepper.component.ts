import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { StepDirective } from './step.directive';

@Component({
  selector: 'md-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  @ContentChildren(StepDirective) steps!: QueryList<StepDirective>;

  currentIndex = 0;
  @Output() onNext = new EventEmitter<TemplateRef<any>>();
  @Output() onFinish = new EventEmitter<void>();
  @Input() context!: any;
  constructor(private cdr: ChangeDetectorRef) {}

  next() {
    if (this.currentIndex + 1 == this.steps.length) {
      this.onFinish.emit();
    } else {
      this.currentIndex++;
      this.onNext.emit(this.steps.get(this.currentIndex)?.templateRef);
    }
    this.cdr.detectChanges();
  }

  previous() {
    if (this.currentIndex - 1 < 0) {
      this.onFinish.emit();
    } else {
      this.currentIndex--;
    }
    this.cdr.detectChanges();
  }

  reset() {
    this.currentIndex = 0;
    this.cdr.detectChanges();
  }
}
