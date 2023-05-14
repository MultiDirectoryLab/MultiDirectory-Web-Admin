import type { Meta, StoryObj } from '@storybook/angular';
import { Treenode, TreeviewComponent } from "./treeview.component"
import { of } from 'rxjs';

export default {
    component: TreeviewComponent,
    title: 'Base/Treeview'
} as Meta<TreeviewComponent>;


export const Primary: StoryObj<TreeviewComponent> = {
    args: {
      tree: [new Treenode({
        name: 'root1', 
        icon: '',
        expanded: false,
        children: [
          new Treenode({
            name: 'child1',
            icon: '',
            expanded: false,
            children: [
              new Treenode({
                name: 'child11',
                icon: '',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child12',
                icon: '',
                expanded: false,
                children: null
              })
            ]
          }),
          new Treenode({
            name: 'child2',
            icon: '',
            expanded: false,
            children: [
              new Treenode({
                name: 'child21',
                icon: '',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child22',
                icon: '',
                expanded: false,
                children: null
              })
            ]
          }),
        ]
      }),
      new Treenode({
        name: 'root2', 
        icon: '',
        expanded: false,
        children: [
          new Treenode({
            name: 'child1',
            icon: '',
            expanded: false,
            loadChildren: () => of([
              new Treenode({
                name: 'child11',
                icon: '',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child12',
                icon: '',
                expanded: false,
                children: null
              })
            ])
          }),
          new Treenode({
            name: 'child2',
            icon: '',
            expanded: false,
            loadChildren: () => of([
              new Treenode({
                name: 'child21',
                icon: '',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child22',
                icon: '',
                expanded: false,
                children: null
              })
            ])
          }),
        ]
      })
    
    ]},
};