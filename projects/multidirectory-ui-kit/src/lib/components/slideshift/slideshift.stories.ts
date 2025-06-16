import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlideshiftTestComponent } from './slideshifttest.component';

import { provideAnimations } from '@angular/platform-browser/animations';

const meta: Meta<SlideshiftTestComponent> = {
  title: 'Layout/Slideshift',
  component: SlideshiftTestComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [CommonModule, FormsModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<SlideshiftTestComponent>;
export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
            <app-slideshift-test></app-slideshift-test>
        `,
    props: {
      onAlert: (num: number) => alert(num),
    },
  }),
};
