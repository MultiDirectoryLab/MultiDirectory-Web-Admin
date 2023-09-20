import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DatagridComponent } from './datagrid.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const meta: Meta<DatagridComponent> = {
    title: 'Components/Datagrid',
    component: DatagridComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [NgxDatatableModule, CommonModule, FormsModule],
            declarations: [DatagridComponent, DropdownComponent]
        }),
    ]
}

export default meta;

type Story = StoryObj<DatagridComponent>;
export const Primary: Story = {
    args: {
    },
    render: () => ({
        template: `
            <div style="height: 250px; padding: 1rem">
                <md-datagrid></md-datagrid>
            </div>
        `,
    })
  };