import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { MdModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';
import { ModalTestComponent } from './modaltest.component';
import { ModalInjectDirective } from './modal-inject.directive';
import { TextboxComponent } from '../textbox/textbox.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from './ng-modal-lib/public-api';

const meta: Meta<MdModalComponent> = {
  title: 'Components/Modal',
  component: MdModalComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ModalModule, CommonModule, FormsModule],
      declarations: [ButtonComponent, ModalTestComponent, ModalInjectDirective, TextboxComponent],
      entryComponents: [ModalInjectDirective, MdModalComponent],
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

type Story = StoryFn<MdModalComponent>;
const template: Story = (args: MdModalComponent) => ({
  props: {
    value: 10,
  },
  template: `
    <md-button [primary]=true (click)="modal.open()" >Open modal</md-button>
    <br /><br />
    <app-modal-test #modal></app-modal-test>
    `,
});

export const SimpleExample = template.bind({});
SimpleExample.args = {} as Partial<MdModalComponent>;
