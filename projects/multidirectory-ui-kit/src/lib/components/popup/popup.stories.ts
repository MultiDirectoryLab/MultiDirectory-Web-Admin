import { PopupBaseComponent } from './base/popup-base.component';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { PopupTestComponent } from './popuptest/popuptest.component';
import { ButtonComponent } from '../button/button.component';
import { PopupContainerDirective } from './popup-container.directive';
import { PopupSuggestComponent } from './suggest/popup-suggest.component';

const meta: Meta<PopupBaseComponent> = {
  title: 'PopupBase',
  decorators: [
    moduleMetadata({
      declarations: [
        PopupBaseComponent,
        PopupTestComponent,
        PopupSuggestComponent,
        ButtonComponent,
        PopupContainerDirective,
      ],
    }),
  ],
  component: PopupTestComponent,
};
export default meta;

type Story = StoryObj<PopupTestComponent>;

export const Primary: Story = {};
