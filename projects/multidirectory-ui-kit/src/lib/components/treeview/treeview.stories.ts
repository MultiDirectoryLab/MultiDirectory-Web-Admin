import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TreeviewComponent } from './treeview.component';
import { of } from 'rxjs';
import { Treenode } from './model/treenode';

const meta: Meta<TreeviewComponent> = {
  title: 'Components/Treeview',
  component: TreeviewComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [TreeviewComponent],
    }),
  ],
};
export default meta;
export const Primary: StoryObj<TreeviewComponent> = {
  args: {
    tree: [
      new Treenode({
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
                children: [],
              }),
              new Treenode({
                name: 'child12',
                expanded: false,
                children: [],
              }),
            ],
          }),
          new Treenode({
            name: 'child2',
            expanded: false,
            children: [
              new Treenode({
                name: 'child21',
                expanded: false,
                children: [],
              }),
              new Treenode({
                name: 'child22',
                expanded: false,
                children: [],
              }),
            ],
          }),
        ],
      }),
      new Treenode({
        name: 'root2',
        expanded: false,
        children: [
          new Treenode({
            name: 'child1',
            expanded: false,
            children: [],
            loadChildren: () =>
              of([
                new Treenode({
                  name: 'child11',
                  expanded: false,
                  children: [],
                }),
                new Treenode({
                  name: 'child12',
                  expanded: false,
                  children: [],
                }),
              ]),
          }),
          new Treenode({
            name: 'child2',
            expanded: false,
            children: [],
            loadChildren: () =>
              of([
                new Treenode({
                  name: 'child21',
                  expanded: false,
                  children: [],
                }),
                new Treenode({
                  name: 'child22',
                  expanded: false,
                  children: [],
                }),
              ]),
          }),
        ],
      }),
    ],
  },
};
