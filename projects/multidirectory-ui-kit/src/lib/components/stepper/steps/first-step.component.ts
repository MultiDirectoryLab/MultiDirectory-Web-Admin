import { Component, Input } from '@angular/core';
import { TestData } from '../stepperttest.component';
import { TextboxComponent } from '../../textbox/textbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'test-first-step',
  imports: [TextboxComponent, FormsModule],
  template: `
    <div style="width:200px;">
      <label>First</label>
      <md-textbox [(ngModel)]="context.firstStep"></md-textbox>
    </div>
  `,
})
export class FirstStepComponent {
  @Input() context: TestData = {} as TestData;
}
