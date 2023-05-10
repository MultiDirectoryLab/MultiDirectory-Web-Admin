import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { DropdownMenuComponent } from "./dropdown-menu.component";
import { ButtonComponent } from "multidirectory-ui-kit";

const meta: Meta<DropdownMenuComponent> = {
    title: 'Base/DropdownMenu',
    component: DropdownMenuComponent,
    decorators: [
        moduleMetadata({
            declarations: [
                ButtonComponent
            ]
        })
    ],
    tags: ['autodocs']
}

export default meta;

type Story = StoryObj<DropdownMenuComponent>;
export const Primary: Story = {
    args: {
    },
    render: () => ({
        template: `
            <md-button (click)="menu.toggle()">Open</md-button>
            <md-dropdown-menu #menu>
                <div class="dropdown-item">test</div>
                <hr />
                <div class="dropdown-item">test</div>
            </md-dropdown-menu>
        `,

    })
}