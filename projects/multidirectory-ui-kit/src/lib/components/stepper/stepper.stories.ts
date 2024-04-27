import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { StepperComponent } from './stepper.component';
import { StepperTestModule } from './stepperttest.component';

const meta: Meta<StepperComponent> = {
  title: 'Layout/Stepper',
  component: StepperComponent,
  decorators: [
    moduleMetadata({
      imports: [StepperTestModule],
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
