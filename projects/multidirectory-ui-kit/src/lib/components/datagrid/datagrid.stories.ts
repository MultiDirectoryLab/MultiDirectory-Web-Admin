import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DatagridComponent } from './datagrid.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const meta: Meta<DatagridComponent> = {
    title: 'Components/Datagrid',
    component: DatagridComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [NgxDatatableModule],
            declarations: [DatagridComponent]
        }),
    ]
}

export default meta;

type Story = StoryObj<DatagridComponent>;
export const Primary: Story = {
    args: {
    },
  };