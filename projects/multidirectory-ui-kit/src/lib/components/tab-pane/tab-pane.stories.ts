import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { ModalModule } from 'ng-modal-full-resizable';
import { TabPaneComponent  } from './tab-pane.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { PlaneButtonComponent } from '../plane-button/plane-button.component';
const meta: Meta<TabPaneComponent> = {
    title: 'Components/TabPane',
    component: TabPaneComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [BrowserAnimationsModule, ModalModule, NgxSpinnerModule, CommonModule],
            declarations: [TabPaneComponent, TabComponent, PlaneButtonComponent]
        }),
    ]
    
}

export default meta;

type Story = StoryFn<TabPaneComponent>;
const template: Story = (args: TabPaneComponent) => ({
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
      
        
    `
});

export const SimpleExample = template.bind({});
SimpleExample.args = {
} as Partial<TabPaneComponent>;