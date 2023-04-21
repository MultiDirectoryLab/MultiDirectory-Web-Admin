import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from 'projects/multidirectory-ui/src/lib/components/button/button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Base/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: { click: { action: 'clicked' } },
  render: (args: ButtonComponent) => ({
    props: {
      backgroundColor: null,
      ...args,
    },
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Primary: Story = {
  args: {
    label: 'Button',
  },
};
export const Disabled: Story = {
  args: {
    label: 'Button',
    disabled: true
  },
};
 