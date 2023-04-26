import type { Meta, StoryObj } from '@storybook/angular';
import { TextboxComponent } from "./textbox.component";

const meta: Meta<TextboxComponent> = {
    title: 'Base/Textbox',
    component: TextboxComponent,
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<TextboxComponent>;
export const Primary: Story = {
    args: {
      label: 'Textbox: ',
    },
  };