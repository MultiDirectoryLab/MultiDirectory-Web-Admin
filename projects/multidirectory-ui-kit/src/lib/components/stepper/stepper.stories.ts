import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { StepperComponent } from "./stepper.component";
import { FirstStepComponent } from "./steps/first-step.component";
import { SecondStepComponent } from "./steps/second-step.component";
import { ThirdStepComponent } from "./steps/third-step.component";
import { StepDirective } from "./step.directive";
import { StepperTestComponent } from "./stepperttest.component";
import { TextboxComponent } from "multidirectory-ui-kit";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

const meta: Meta<StepperComponent> = {
    title: 'Layout/Stepper',
    component: StepperComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
            ],
            declarations: [
                StepperComponent,
                StepperTestComponent,
                FirstStepComponent, 
                SecondStepComponent, 
                ThirdStepComponent, 
                TextboxComponent,
                StepDirective
            ]
        })
    ],
}

export default meta;

type Story = StoryObj<StepperComponent>;
export const Primary: Story = {
    args: {
    },
    render: () => ({
        template: `
            <md-stepper-test></md-stepper-test>
        `,       

    })
}