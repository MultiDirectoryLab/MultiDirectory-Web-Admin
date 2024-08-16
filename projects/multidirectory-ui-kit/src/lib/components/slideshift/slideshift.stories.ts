import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { MdSlideshiftComponent } from './slideshift.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { SlideshiftTestComponent } from './slideshifttest.component';
import { MdSlideshiftModule } from './slideshift.module';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

const meta: Meta<SlideshiftTestComponent> = {
  title: 'Layout/Slideshift',
  component: SlideshiftTestComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [CommonModule, FormsModule, MdSlideshiftModule],
      declarations: [ButtonComponent, SlideshiftTestComponent],
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
