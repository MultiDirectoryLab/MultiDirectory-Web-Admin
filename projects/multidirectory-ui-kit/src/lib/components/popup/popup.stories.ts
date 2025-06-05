import { PopupBaseComponent } from './base/popup-base.component';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { PopupTestComponent } from './popuptest/popuptest.component';

const meta: Meta<PopupBaseComponent> = {
  title: 'PopupBase',
  decorators: [moduleMetadata({})],
  component: PopupTestComponent,
};
export default meta;

type Story = StoryObj<PopupTestComponent>;

export const Primary: Story = {};
