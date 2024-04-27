import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { DatepickerComponent } from './datepicker.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const meta: Meta<DatepickerComponent> = {
  title: 'Components/Datepicker',
  component: DatepickerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [DpDatePickerModule, FormsModule, CommonModule],
      declarations: [DatepickerComponent],
    }),
  ],
};

export default meta;

type Story = StoryObj<DatepickerComponent>;
export const Primary: Story = {
  render: () => ({
    template: `
      <md-datepicker [(ngModel)]="value"></md-datepicker>
      {{value}}
    `,
    props: {
      value: '',
    },
  }),
};
