import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { ModalModule } from 'ng-modal-full-resizable';
import { SpinnerComponent } from './spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const meta: Meta<SpinnerComponent> = {
    title: 'Components/Spinner',
    component: SpinnerComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [BrowserAnimationsModule, ModalModule, NgxSpinnerModule],
            declarations: [SpinnerComponent]
        }),
    ]
    
}

export default meta;

type Story = StoryFn<SpinnerComponent>;
const template: Story = (args: SpinnerComponent) => ({
    props: args,
    template: `
        <md-spinner #spinner></md-spinner>
        <button (click)="spinner.show()">Click</button>
    `
});

export const SimpleExample = template.bind({});
SimpleExample.args = {
} as Partial<SpinnerComponent>;