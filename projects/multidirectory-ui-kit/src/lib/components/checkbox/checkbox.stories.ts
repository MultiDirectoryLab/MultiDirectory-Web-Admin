import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { CheckboxComponent } from "./checkbox.component";

const meta: Meta<CheckboxComponent> = {
    title: 'Components/Checkbox',
    component: CheckboxComponent,
    decorators: [
    ],
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<CheckboxComponent>;
export const Primary: Story = {
    args: {
    },
    render: () => ({
        template: `
            <md-checkbox>Checkbox</md-checkbox>
        `,

    })
}