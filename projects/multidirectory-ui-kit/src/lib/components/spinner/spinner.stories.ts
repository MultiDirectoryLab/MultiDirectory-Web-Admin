import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
const meta: Meta<SpinnerComponent> = {
  title: 'Components/Spinner',
  component: SpinnerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgxSpinnerModule],
      declarations: [SpinnerComponent],
    }),
  ],
};

export default meta;

type Story = StoryObj<SpinnerComponent>;
const template: Story = {
  render: (args) => ({
    template: `
          <md-spinner #spinner></md-spinner>
          <button (click)="spinner.show()">Click</button>
      `,
  }),
};

export const SimpleExample = template;
