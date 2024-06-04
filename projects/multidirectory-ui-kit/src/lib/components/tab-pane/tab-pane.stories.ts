import { Meta, StoryFn, StoryObj, moduleMetadata } from '@storybook/angular';
import { TabPaneComponent } from './tab-pane.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { PlaneButtonComponent } from '../plane-button/plane-button.component';
import { ModalModule } from '../modal/ng-modal-lib/public-api';
const meta: Meta<TabPaneComponent> = {
  title: 'Components/TabPane',
  component: TabPaneComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ModalModule, NgxSpinnerModule, CommonModule],
      declarations: [TabPaneComponent, TabComponent, PlaneButtonComponent],
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
                  <md-tab [elRef]="first">tab1</md-tab>
                  <md-tab [elRef]="second">tab2</md-tab>
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
