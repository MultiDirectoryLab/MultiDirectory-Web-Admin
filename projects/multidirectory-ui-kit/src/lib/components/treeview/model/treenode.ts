export class Treenode {
  id: string = '';
  name: string = '';

  selectable = false;
  selected = false;
  expandable = true;
  expanded = false;
  focused = false;

  children: Treenode[] = [];
  parent?: Treenode;

  constructor(obj: Partial<Treenode>) {
    Object.assign(this, obj);
  }
}
