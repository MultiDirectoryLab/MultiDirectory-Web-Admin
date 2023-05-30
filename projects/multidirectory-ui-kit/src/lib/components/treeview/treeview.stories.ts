import type { Meta, StoryObj } from '@storybook/angular';
import { Treenode, TreeviewComponent } from "./treeview.component"
import { of } from 'rxjs';

export default {
    component: TreeviewComponent,
    title: 'Components/Treeview'
} as Meta<TreeviewComponent>;


export const Primary: StoryObj<TreeviewComponent> = {
    args: {
      tree: [new Treenode({
        name: 'root1', 
        expanded: false,
        children: [
          new Treenode({
            name: 'child1',
            expanded: false,
            children: [
              new Treenode({
                name: 'child11',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child12',
                expanded: false,
                children: null
              })
            ]
          }),
          new Treenode({
            name: 'child2',
            expanded: false,
            children: [
              new Treenode({
                name: 'child21',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child22',
                expanded: false,
                children: null
              })
            ]
          }),
        ]
      }),
      new Treenode({
        name: 'root2', 
        expanded: false,
        children: [
          new Treenode({
            name: 'child1',
            expanded: false,
            loadChildren: () => of([
              new Treenode({
                name: 'child11',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child12',
                expanded: false,
                children: null
              })
            ])
          }),
          new Treenode({
            name: 'child2',
            expanded: false,
            loadChildren: () => of([
              new Treenode({
                name: 'child21',
                expanded: false,
                children: null
              }),
              new Treenode({
                name: 'child22',
                expanded: false,
                children: null
              })
            ])
          }),
        ]
      })
    
    ]},
};