import { Meta, StoryFn, StoryObj, moduleMetadata } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { NgxSpinnerModule } from 'ngx-spinner';
const meta: Meta<TextareaComponent> = {
  title: 'Components/Textarea',
  component: TextareaComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgxSpinnerModule],
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
