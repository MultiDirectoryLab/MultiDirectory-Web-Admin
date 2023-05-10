import { Meta, StoryFn, StoryObj, moduleMetadata } from '@storybook/angular';
import { TextboxComponent } from "./textbox.component";
import { FormsModule } from '@angular/forms';

const meta: Meta<TextboxComponent> = {
    title: 'Base/Textbox',
    component: TextboxComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [FormsModule]
        }),
    ]
}

export default meta;

export const Primary: StoryFn<TextboxComponent> = (args: TextboxComponent) => ({
  props: args,
  styles: ['textbox.component.scss'],
  template: `
  <div class="row">
    <label class="col-md-1" style="padding-right: 8px;">Primary: </label>
    <md-textbox class="col-md-2" [(ngModel)]="model"></md-textbox>
  </div>
  `
});

export const Password: StoryFn<TextboxComponent> = (args: TextboxComponent) => ({
  props: args,
  template: `
  <div class="row">
    <label  class="col-md-1" style="padding-right: 8px;">Password: </label>
    <md-textbox  class="col-md-2" [(ngModel)]="model" [password]="true"></md-textbox>
  </div>
  `
});


export const template: StoryFn<TextboxComponent> = (args: TextboxComponent) => ({
  props: args,
  template: `
  <div class="row">
    <label  class="col-md-1" style="padding-right: 8px;">Login: </label>
    <md-textbox  class="col-md-2" [(ngModel)]="model"></md-textbox>
  </div>
  `
});