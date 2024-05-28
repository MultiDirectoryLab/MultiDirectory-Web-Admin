import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownMenuComponent } from './dropdown-menu.component';
import { DropdownContainerDirective } from './dropdown-container.directive';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<DropdownMenuComponent> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenuComponent,
  decorators: [
    moduleMetadata({
      declarations: [ButtonComponent, DropdownContainerDirective],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<DropdownMenuComponent>;
export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
            <div style="height: 320px;">
                <md-dropdown-menu #menuRef>
                    <div class="dropdown-item" tabindex=0>test</div>
                    <div class="dropdown-item" tabindex=0>test</div>
                </md-dropdown-menu>
                <md-button [mdDropdownContainer]="menuRef">Open</md-button>
            </div>
        `,
  }),
};
