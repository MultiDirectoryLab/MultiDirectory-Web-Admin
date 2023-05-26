import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { StepDirective } from "./step.directive";
@Component({
    selector: 'md-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {

    @ContentChildren(StepDirective) content!: QueryList<StepDirective>;
    currentIndex = 0;
    @Output() onFinish = new EventEmitter<void>();
    @Input() context!: any;


    next() {
        this.currentIndex++;
        if(this.currentIndex == this.content.length) {
            this.currentIndex = -1;
            this.onFinish.emit();
        }
    }
}