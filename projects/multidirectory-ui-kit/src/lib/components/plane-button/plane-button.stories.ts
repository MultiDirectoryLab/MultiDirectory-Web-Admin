import type { Meta, StoryObj } from '@storybook/angular';
import { PlaneButtonComponent } from './plane-button.component';

const meta: Meta<PlaneButtonComponent> = {
  title: 'Base/PlaneButton',
  component: PlaneButtonComponent,
  tags: ['autodocs'],
  argTypes: { click: { action: 'clicked' } },
  render: (args: PlaneButtonComponent) => { 
     return ({
        props: {
          backgroundColor: null,
          ...args,
        },
        template: `
          <md-plane-button [disabled]="disabled" (click)="click()"> </md-plane-button>
        `
  })
  },
};

export default meta;
type Story = StoryObj<PlaneButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Regular: Story = {
  args: {
  }
};
export const RegularDisabled: Story = {
  args: {
    disabled: true
  }, 
}