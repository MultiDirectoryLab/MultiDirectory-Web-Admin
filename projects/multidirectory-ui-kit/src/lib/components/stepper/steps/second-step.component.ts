import { Component, Input } from '@angular/core';
import { TestData } from '../stepperttest.component';
import { TextboxComponent } from '../../textbox/textbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'test-second-step',
  imports: [TextboxComponent, FormsModule],
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
