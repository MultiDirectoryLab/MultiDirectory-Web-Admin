import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from "@angular/core";
import { StepDirective } from "./step.directive";
@Component({
    selector: 'md-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent {
    @ContentChildren(StepDirective) steps!: QueryList<StepDirective>;
    currentIndex = 0;
    @Output() onNext = new EventEmitter<TemplateRef<any>>();
    @Output() onFinish = new EventEmitter<void>();
    @Input() context!: any;
    constructor(private cdr: ChangeDetectorRef) {}
    next() {
        this.currentIndex++;
        this.cdr.detectChanges();
        if(this.currentIndex == this.steps.length) {
            this.currentIndex = -1;
            this.onFinish.emit();
        } else {
            this.onNext.emit(this.steps.get(this.currentIndex)?.templateRef)
        }
    }
}