import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MultiselectComponent } from './multiselect.component';
import { MultiselectBadgeComponent } from './multiselect-badge/multiselect-badge.component';
import { MultiselectModel } from './mutliselect-model';
import { DropdownContainerDirective } from '../dropdown-menu/dropdown-container.directive';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

const meta: Meta<MultiselectComponent> = {
  title: 'Components/Multiselect',
  component: MultiselectComponent,
  decorators: [moduleMetadata({})],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<MultiselectComponent>;
export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
            <div style="height: 320px;">
                <md-multiselect [options]="options"></md-multiselect>
            </div>
        `,
    props: {
      options: [
        new MultiselectModel({ id: '1', key: 'city', selected: false, title: 'New York' }),
        new MultiselectModel({ id: '2', key: 'city', selected: false, title: 'Login' }),
      ],
    },
  }),
};
