import { Meta, StoryFn, StoryObj, moduleMetadata } from '@storybook/angular';
import { MdModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';
import { ModalTestComponent } from './modal-test.component';
import { ModalInjectDirective } from './modal-inject/modal-inject.directive';
import { TextboxComponent } from '../textbox/textbox.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdModalModule } from './modal.module';
import { MdPortalModule } from '../portal/portal.module';
import { MdSpinnerModule } from '../spinner/spinner.module';

const meta: Meta<MdModalComponent> = {
  title: 'Components/Modal',
  component: MdModalComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, MdModalModule, MdPortalModule, MdSpinnerModule],
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
  render: (args) => ({
    template: `
      <md-button [primary]=true (click)="modal.open()" >Open modal</md-button>
      <br /><br />
      <app-modal-test #modal></app-modal-test>
      `,
  }),
};

export const SimpleExample = template;
