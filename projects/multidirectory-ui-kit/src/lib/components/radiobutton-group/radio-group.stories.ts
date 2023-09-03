import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { RadioGroupComponent } from "./radio-group.component";
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";

const meta: Meta<RadioGroupComponent> = {
    title: 'Layout/RadioGroup',
    component: RadioGroupComponent,
    decorators: [
        moduleMetadata({
            declarations: [
                RadiobuttonComponent
            ]
        })
    ],
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<RadioGroupComponent>;
export const Primary: Story = {
    args: {
    },
    render: () => ({
        template: `
            <md-radiogroup #radiogroup style="width: 150px">
                <md-radiobutton name="viewmode" value="1" [group]="radiogroup">test</md-radiobutton>
                <md-radiobutton name="viewmode" value="1" [group]="radiogroup">test 1</md-radiobutton>
                <md-radiobutton name="viewmode" value="1" [group]="radiogroup">test 2</md-radiobutton>
            </md-radiogroup>

        `,

    })
}