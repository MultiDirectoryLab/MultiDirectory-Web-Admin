import { Meta, StoryObj } from "@storybook/angular";
import { NumberComponent } from "./number.component";

const meta: Meta<NumberComponent> = {
    title: 'Components/Number',
    component: NumberComponent,
    tags: ['autodocs']
}
export default meta;
type Story = StoryObj<NumberComponent>;
export const Primary: Story = {
    args: {
        label: 'Number', 
        step: 1
    }
}