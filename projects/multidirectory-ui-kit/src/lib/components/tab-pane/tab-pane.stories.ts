import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { TabPaneComponent } from './tab-pane.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';

const meta: Meta<TabPaneComponent> = {
  title: 'Components/TabPane',
  component: TabPaneComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgxSpinnerModule, CommonModule, TabComponent, TabPaneComponent],
    }),
  ],
};

export default meta;

type Story = StoryObj<TabPaneComponent>;
const template: Story = {
  render: (args) => ({
    props: args,
    template: `
          <md-tab-pane>
              <div class="tab-header">
                  <md-tab [el]="first">tab1</md-tab>
                  <md-tab [el]="second">tab2</md-tab>
              </div>
              <div #first>
                  first
              </div>

              <div #second>
                  second
              </div>
          </md-tab-pane>


      `,
  }),
};

export const SimpleExample = template;
