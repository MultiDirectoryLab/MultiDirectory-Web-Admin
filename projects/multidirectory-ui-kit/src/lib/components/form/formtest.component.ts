import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-formtest',
  styles: [
    `
      .w-300 {
        width: 300px;
      }
    `,
  ],
  template: `
    <md-form>
      <div class="w-300">
        <label>First</label>
        <md-textbox required [formControl]="first"></md-textbox>
      </div>
      <div class="w-300">
        <label>Second</label>
        <md-textbox required [formControl]="second"></md-textbox>
      </div>
      <div class="w-300">
        <label>Third</label>
        <md-textbox required [formControl]="third"></md-textbox>
      </div>
    </md-form>
  `,
})
export class FormTestComponent {
  first = new FormControl('');
  second = new FormControl('');
  third = new FormControl('');
}
