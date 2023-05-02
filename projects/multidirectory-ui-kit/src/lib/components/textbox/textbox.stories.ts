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
  template: `
  <div>
    <label style="padding-right: 8px;">Primary: </label>
    <md-textbox [(ngModel)]="model"></md-textbox>
  </div>
  `
});

export const Password: StoryFn<TextboxComponent> = (args: TextboxComponent) => ({
  props: args,
  template: `
  <div>
    <label style="padding-right: 8px;">Password: </label>
    <md-textbox [(ngModel)]="model" [password]="true"></md-textbox>
  </div>
  `
});


export const template: StoryFn<TextboxComponent> = (args: TextboxComponent) => ({
  props: args,
  template: `
  <div>
    <label style="padding-right: 8px;">Login: </label>
    <md-textbox [(ngModel)]="model"></md-textbox>
  </div>
  `
});