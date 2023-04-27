import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from 'projects/multidirectory-ui-kit/src/lib/components/button/button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Base/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: { click: { action: 'clicked' } },
  render: (args: ButtonComponent) => {console.log({
    backgroundColor: null,
    ...args,
  }); return ({
    props: {
      backgroundColor: null,
      ...args,
    },
    template: `
      <md-button [primary]="primary" [disabled]="disabled" (click)="click()">Button</md-button>
    `
  })
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
  },
};
export const PrimaryDisabled: Story = {
  args: {
    primary: true,
    disabled: true
  },
};
export const Regular: Story = {
  args: {
  }
};
export const RegularDisabled: Story = {
  args: {
    disabled: true
  }, 
}