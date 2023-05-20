import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { RadiobuttonComponent, RadiogroupComponent } from "./radiobutton.component";

const meta: Meta<RadiobuttonComponent> = {
    title: 'Components/Radiobutton',
    component: RadiobuttonComponent,
    decorators: [
        moduleMetadata({
            declarations: [RadiogroupComponent]
        })
    ],
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<RadiobuttonComponent>;
export const Primary: Story = {
    args: {
    },
    render: () => ({
        template: `
            <md-radiogroup #radiogroup [(ngModel)]="model"></md-radiogroup>
            <md-radiobutton name="group" value="1" [group]="radiogroup">Test</md-radiobutton>
            <md-radiobutton name="group" value="2" [group]="radiogroup">Test2</md-radiobutton>
        `,

    })
}