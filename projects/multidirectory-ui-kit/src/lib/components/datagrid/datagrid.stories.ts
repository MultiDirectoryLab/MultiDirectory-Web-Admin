import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DatagridComponent } from './datagrid.component';
import { NgxDatatableModule } from 'ngx-datatable-gimefork';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Page } from './page';

const meta: Meta<DatagridComponent> = {
  title: 'Components/Datagrid',
  component: DatagridComponent,
  decorators: [
    moduleMetadata({
      imports: [NgxDatatableModule, CommonModule, FormsModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<DatagridComponent>;
export const NonPaging: Story = {
  args: {
    columns: [{ name: 'name' }],
    rows: Array.from(Array.from(Array(25).keys())).map((x) => {
      return { name: x };
    }),
    scrollbarV: true,
  },
  play: async ({ canvasElement }) => {
    console.log('play');
  },
  argTypes: { pageChange: { action: 'clicked' } },
  render: () => ({
    props: {
      columns: [{ name: 'name' }],
      rows: Array.from(Array.from(Array(25).keys())).map((x) => {
        return { name: x };
      }),
      pageChanged: () => {
        console.log('page');
      },
      page: new Page({ totalElements: 25, size: 5, pageNumber: 0 }),
    },
    template: `
            <div style="height: 250px; padding: 1rem">
                <md-datagrid 
                    (pageChanged)="pageChanged"
                    [page]="page"
                    [stretchHeight]="true"
                    [scrollbarV]="true"
                    [columns]="columns" 
                    [rows]="rows"></md-datagrid>
            </div>
        `,
  }),
};

export const Primary: Story = {
  args: {
    columns: [{ name: 'name' }],
    rows: Array.from(Array.from(Array(25).keys())).map((x) => {
      return { name: x };
    }),
  },
  render: () => ({
    props: {
      columns: [{ name: 'name' }],
      rows: Array.from(Array.from(Array(25).keys())).map((x) => {
        return { name: x };
      }),
      page: new Page({ totalElements: 25, size: 5, pageNumber: 0 }),
    },
    template: `
            <div style="height: 250px; padding: 1rem">
                <md-datagrid 
                    [page]="page"
                    [columns]="columns" 
                    [rows]="rows"></md-datagrid>
            </div>
        `,
  }),
};

export const WithControlPanel: Story = {
  args: {
    columns: [{ name: 'name' }],
    rows: Array.from(Array.from(Array(25).keys())).map((x) => {
      return { name: x };
    }),
  },
  render: () => ({
    props: {
      columns: [
        {
          name: 'Column Name',
        },
      ],
      rows: Array.from(Array.from(Array(25).keys())).map((x) => {
        return { columnName: x };
      }),
      page: new Page({ totalElements: 25, size: 5, pageNumber: 0 }),
    },
    template: `
            <div style="height: 250px; padding: 1rem">
                <md-datagrid 
                    [controlPanelRef]="controlPanel"
                    [page]="page"
                    [columns]="columns" 
                    [rows]="rows"></md-datagrid>
            </div>

            <ng-template #controlPanel>
              I am control panel
            </ng-template>
        `,
  }),
};

export const WithExternalSorting: Story = {
  args: {
    columns: [{ name: 'name' }],
    rows: Array.from(Array.from(Array(25).keys())).map((x) => {
      return { name: x };
    }),
  },
  render: () => ({
    props: {
      columns: [
        {
          name: 'Column Name',
        },
      ],
      rows: Array.from(Array.from(Array(25).keys())).map((x) => {
        return { columnName: x };
      }),
      page: new Page({ totalElements: 25, size: 5, pageNumber: 0 }),
      onSort: (event: any) => {},
    },
    template: `
            <div style="height: 250px; padding: 1rem">
                <md-datagrid 
                    [controlPanelRef]="controlPanel"
                    [page]="page"
                    [columns]="columns" 
                    [rows]="rows"
                    [externalSorting]="false"
                    (sort)="onSort($event)"
                    ></md-datagrid>
            </div>
            <ng-template #controlPanel>
              I am control panel
            </ng-template>
        `,
  }),
};
