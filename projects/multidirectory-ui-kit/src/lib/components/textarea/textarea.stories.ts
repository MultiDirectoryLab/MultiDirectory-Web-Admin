import { Meta, StoryFn, StoryObj, moduleMetadata } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from '../modal/ng-modal-lib/public-api';
const meta: Meta<TextareaComponent> = {
  title: 'Components/Textarea',
  component: TextareaComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ModalModule, NgxSpinnerModule],
      declarations: [TextareaComponent],
    }),
  ],
};

export default meta;

type Story = StoryObj<TextareaComponent>;
const template: Story = {
  render: (args) => ({
    props: args,
    template: `
          <md-textarea #spinner></md-textarea>
      `,
  }),
};

export const SimpleExample = template;
