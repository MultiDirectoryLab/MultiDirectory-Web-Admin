import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

const meta: Meta<TooltipComponent> = {
  title: 'Components/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, CommonModule],
      declarations: [TooltipComponent],
    }),
  ],
};

export default meta;

export const Primary: StoryObj<TooltipComponent> = {
  args: {},
  render: () => ({
    template: `
            <md-tooltip>
                Пример:<br />
                192.168.0.1<br />
                192.168.0.1-192.168.0.5<br />
                192.168.0.1/24<br />
            </md-tooltip>
        `,
  }),
};
