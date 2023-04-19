import type { Meta, StoryObj } from '@storybook/angular';
import { TextareaComponent } from "./textarea.component";

const meta: Meta<TextareaComponent> = {
    title: 'Base/Textarea',
    component: TextareaComponent,
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<TextareaComponent>;
export const Primary: Story = {
    args: {
      label: 'Textarea: ',
    },
  };