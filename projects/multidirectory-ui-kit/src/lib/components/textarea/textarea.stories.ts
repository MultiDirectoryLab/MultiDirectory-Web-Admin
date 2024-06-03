import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { TextareaComponent } from './textarea.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from '../modal/ng-modal-lib/public-api';
const meta: Meta<TextareaComponent> = {
  title: 'Components/Textarea',
  component: TextareaComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, ModalModule, NgxSpinnerModule],
      declarations: [TextareaComponent],
    }),
  ],
};

export default meta;

type Story = StoryFn<TextareaComponent>;
const template: Story = (args: TextareaComponent) => ({
  props: args,
  template: `
        <md-textarea #spinner></md-textarea>
    `,
});

export const SimpleExample = template.bind({});
SimpleExample.args = {} as Partial<TextareaComponent>;
