import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MdModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';
import { ModalTestComponent } from './modal-test.component';
import { ModalInjectDirective } from './modal-inject/modal-inject.directive';
import { TextboxComponent } from '../textbox/textbox.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const meta: Meta<MdModalComponent> = {
  title: 'Components/Modal',
  component: MdModalComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule],
      declarations: [ButtonComponent, ModalTestComponent, TextboxComponent],
      entryComponents: [MdModalComponent],
      providers: [
        {
          provide: ModalInjectDirective,
          useClass: ModalInjectDirective,
          multi: false,
        },
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<MdModalComponent>;
const template: Story = {
  render: () => ({
    template: `
      <md-button [primary]=true (click)="modal.open()" >Open modal</md-button>
      <br /><br />
      <app-modal-test #modal></app-modal-test>
      `,
  }),
};

export const SimpleExample = template;
