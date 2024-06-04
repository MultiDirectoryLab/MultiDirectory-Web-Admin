import type { Meta, StoryObj } from '@storybook/angular';
import { PlaneButtonComponent } from './plane-button.component';

const meta: Meta<PlaneButtonComponent> = {
  title: 'Components/PlaneButton',
  component: PlaneButtonComponent,
  tags: ['autodocs'],
  argTypes: { click: { action: 'clicked' } },
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <div style="width: 48px">
        <md-plane-button [disabled]="disabled" [hasBorder]="true" (click)="click()">Button</md-plane-button>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<PlaneButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Regular: Story = {
  args: {},
};
export const RegularDisabled: Story = {
  args: {
    disabled: true,
  },
};
