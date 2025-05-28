import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { StepperComponent } from './stepper.component';
import { StepperTestModule } from './stepperttest.component';
import { TextboxComponent } from '../textbox/textbox.component';
import { ButtonComponent } from '../button/button.component';
import { FirstStepComponent } from './steps/first-step.component';
import { SecondStepComponent } from './steps/second-step.component';
import { ThirdStepComponent } from './steps/third-step.component';

const meta: Meta<StepperComponent> = {
  title: 'Layout/Stepper',
  component: StepperComponent,
  decorators: [
    moduleMetadata({
      imports: [
        StepperTestModule,
        TextboxComponent,
        ButtonComponent,
        FirstStepComponent,
        SecondStepComponent,
        ThirdStepComponent,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<StepperComponent>;
export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
            <md-stepper-test></md-stepper-test>
        `,
  }),
};
