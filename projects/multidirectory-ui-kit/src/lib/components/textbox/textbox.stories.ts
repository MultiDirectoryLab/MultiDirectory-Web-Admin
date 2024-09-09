import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TextboxComponent } from './textbox.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const meta: Meta<TextboxComponent> = {
  title: 'Components/Textbox',
  component: TextboxComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FormsModule, FontAwesomeModule],
    }),
  ],
};

export default meta;

export const Primary: StoryObj<TextboxComponent> = {
  render: (args) => ({
    props: args,
    styles: ['textbox.component.scss'],
    template: `
    <div class="row">
      <label class="col-xs-1" style="padding-right: 8px;">Primary: </label>
      <md-textbox class="col-xs-2" required [(ngModel)]="model"></md-textbox>
    </div>
    `,
  }),
};

export const Password: StoryObj<TextboxComponent> = {
  render: () => ({
    template: `
    <div class="row">
      <label  class="col-xs-1" style="padding-right: 8px;">Password: </label>
      <md-textbox  class="col-xs-2" [(ngModel)]="model" [password]="true"></md-textbox>
    </div>
    `,
  }),
};

export const template: StoryObj<TextboxComponent> = {
  render: () => ({
    template: `
    <div class="row">
      <label  class="col-xs-1" style="padding-right: 8px;">Password: </label>
      <md-textbox  class="col-xs-2" [(ngModel)]="model" [password]="true"></md-textbox>
    </div>
    `,
  }),
};
