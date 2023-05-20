import type { Meta, StoryObj } from '@storybook/angular';
import { DropdownComponent } from "./dropdown.component";

const meta: Meta<DropdownComponent> = {
    title: 'Components/Dropdown',
    component: DropdownComponent,
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<DropdownComponent>;
export const Primary: Story = {
    args: {
      label: 'Dropdown: ',
      options: ['test1', 'test2']
    },
  };