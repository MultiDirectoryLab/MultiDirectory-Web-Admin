import { Component, Input } from "@angular/core";
import { TestData } from "../stepperttest.component";

@Component({
    selector: 'test-third-step',
    template: `
        <div style="width:200px;">
             <label>Third</label>
            <md-textbox [(ngModel)]="context.thirdStep"></md-textbox>
        </div>
    `
})
export class ThirdStepComponent {
    @Input() context: TestData = {} as TestData;
}  