import { Component, Input } from "@angular/core";
import { TestData } from "../stepperttest.component";

@Component({
    selector: 'test-first-step',
    template: `
        <div style="width:200px;">
            <md-textbox [(ngModel)]="context.firstStep"></md-textbox>
        </div>
    `
})
export class FirstStepComponent {
    @Input() context: TestData = {} as TestData;
}  