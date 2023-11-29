import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertComponent } from "./alert.component";
const meta: Meta<AlertComponent> = {
    title: 'Layout/Alert',
    component: AlertComponent,
    decorators: [
        moduleMetadata({
            declarations: [AlertComponent]
        })
    ],
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<AlertComponent>;
export const Primary: Story = {
    render: (arg, context) => ({
        template: `
            <md-alert>test</md-alert>
        `
    }),
    parameters: {
        arg: new FormControl('')
    }
}