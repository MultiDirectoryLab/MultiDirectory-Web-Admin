import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { MdModalComponent } from "./modal.component";
import { ModalModule } from 'ng-modal-full-resizable';

const meta: Meta<MdModalComponent> = {
    title: 'Base/Modal',
    component: MdModalComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [ModalModule],
        }),
    ]
    
}

export default meta;

type Story = StoryFn<MdModalComponent>;
const template: Story = (args: MdModalComponent) => ({
    props: args,
    template: `
    <mdi-modal #modalRoot>
        <ng-container class="app-modal-header">Demo modal</ng-container>
        <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        </ng-container>
        <ng-container class="app-modal-footer">
            <button type="button" class="button button3" (click)="modalRoot.close()">Delete</button>
            <button type="button" class="button button1" (click)="modalRoot.close()">Save</button>
            <button type="button" class="button button2" style="float: right;" (click)="modalRoot.close()">Close
        </button>
        </ng-container>
    </md-modal>
    <button (click)="modalRoot.open()">Open modal</button>
    `
});

export const SimpleExample = template.bind({});
SimpleExample.args = {
  } as Partial<MdModalComponent>;