import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ShiftCheckboxComponent } from './shift-checkbox.component';

const meta: Meta<ShiftCheckboxComponent> = {
  title: 'Components/ShiftCheckbox',
  component: ShiftCheckboxComponent,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<ShiftCheckboxComponent>;
export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
            <md-shift-checkbox (click)="onAlert(1)">Checkbox</md-shift-checkbox>
            <md-shift-checkbox (click)="onAlert(2)">Checkbox</md-shift-checkbox>
        `,
    props: {
      onAlert: (num: number) => alert(num),
    },
  }),
};
