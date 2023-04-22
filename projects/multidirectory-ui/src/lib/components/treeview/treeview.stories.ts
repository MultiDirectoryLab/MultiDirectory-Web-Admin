import type { Meta, StoryObj } from '@storybook/angular';
import { TreeviewComponent } from "./treeview.component"

export default {
    component: TreeviewComponent,
    title: 'Base/Treeview'
} as Meta<TreeviewComponent>;


export const Primary: StoryObj<TreeviewComponent> = {
    args: {
      tree: [{
        name: 'root1', 
        icon: '',
        expanded: false,
        children: [
          {
            name: 'child1',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child11',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child12',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
          {
            name: 'child2',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child21',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child22',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
        ]
      },
      {
        name: 'root2', 
        icon: '',
        expanded: false,
        children: [
          {
            name: 'child1',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child11',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child12',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
          {
            name: 'child2',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child21',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child22',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
        ]
      }
    
    ]},
};