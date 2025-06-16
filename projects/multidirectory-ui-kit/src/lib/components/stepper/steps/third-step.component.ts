import { Component, Input } from '@angular/core';
import { TestData } from '../stepperttest.component';
import { FormsModule } from '@angular/forms';
import { TextboxComponent } from '../../textbox/textbox.component';

@Component({
  selector: 'test-third-step',
  imports: [TextboxComponent, FormsModule],
  template: `
    <div style="width:200px;">
      <label>Third</label>
      <md-textbox [(ngModel)]="context.thirdStep"></md-textbox>
    </div>
  `,
})
export class ThirdStepComponent {
  @Input() context: TestData = {} as TestData;
}
