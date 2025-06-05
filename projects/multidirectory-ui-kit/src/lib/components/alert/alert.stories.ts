import { FormControl } from '@angular/forms';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AlertComponent } from './alert.component';
const meta: Meta<AlertComponent> = {
  title: 'Layout/Alert',
  component: AlertComponent,
  decorators: [moduleMetadata({})],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<AlertComponent>;
export const Primary: Story = {
  render: (arg, context) => ({
    template: `
            <md-alert>test</md-alert>
        `,
  }),
  parameters: {
    arg: new FormControl(''),
  },
};
