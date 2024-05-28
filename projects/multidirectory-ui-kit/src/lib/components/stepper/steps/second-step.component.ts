import { Component, Input } from '@angular/core';
import { TestData } from '../stepperttest.component';

@Component({
  selector: 'test-second-step',
  template: `
    <div style="width:200px;">
      <label>Second</label>
      <md-textbox [(ngModel)]="context.secondStep"></md-textbox>
    </div>
  `,
})
export class SecondStepComponent {
  @Input() context: TestData = {} as TestData;
}
