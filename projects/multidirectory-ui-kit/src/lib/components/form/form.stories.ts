import { MdFormComponent } from './form.component';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormTestComponent } from './formtest.component';
import { TextboxComponent } from '../textbox/textbox.component';

const meta: Meta<MdFormComponent> = {
  title: 'Layout/Form',
  component: MdFormComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, CommonModule],
      declarations: [MdFormComponent, TextboxComponent, FormTestComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<MdFormComponent>;
export const Primary: Story = {
  render: (arg, context) => ({
    template: `
            <app-formtest></app-formtest>
        `,
  }),
  parameters: {
    arg: new FormControl(''),
  },
};
