import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { MdModalComponent } from "./modal.component";
import { ModalModule } from 'ng-modal-full-resizable';
import { ButtonComponent } from '../button/button.component'
const meta: Meta<MdModalComponent> = {
    title: 'Base/Modal',
    component: MdModalComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [ModalModule],
            declarations: [ButtonComponent]
        }),
    ]
    
}

export default meta;

type Story = StoryFn<MdModalComponent>;
const template: Story = (args: MdModalComponent) => ({
    props: args,
    template: `
    <md-modal #modalRoot>
        <ng-container class="app-modal-header">Demo modal</ng-container>
        <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        </ng-container>
        <ng-container class="app-modal-footer">
            <md-button #closeButton (click)="modalRoot.close()">Delete</md-button>
            <md-button [primary]="true" style="float: right;" (click)="modalRoot.close()">Close</md-button>
        </ng-container>
    </md-modal>
    <md-button [primary]=true (click)="modalRoot.open()">Open modal</md-button>
    `
});

export const SimpleExample = template.bind({});
SimpleExample.args = {
} as Partial<MdModalComponent>;