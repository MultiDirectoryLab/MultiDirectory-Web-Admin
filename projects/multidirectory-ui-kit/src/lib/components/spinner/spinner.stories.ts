import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from '../modal/ng-modal-lib/public-api';
const meta: Meta<SpinnerComponent> = {
  title: 'Components/Spinner',
  component: SpinnerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, ModalModule, NgxSpinnerModule],
      declarations: [SpinnerComponent],
    }),
  ],
};

export default meta;

type Story = StoryFn<SpinnerComponent>;
const template: Story = (args: SpinnerComponent) => ({
  props: args,
  template: `
        <md-spinner #spinner></md-spinner>
        <button (click)="spinner.show()">Click</button>
    `,
});

export const SimpleExample = template.bind({});
SimpleExample.args = {} as Partial<SpinnerComponent>;
