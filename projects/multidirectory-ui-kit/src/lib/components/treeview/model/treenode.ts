import { Observable } from 'rxjs';

export class Treenode {
  id: string = '';
  name: string = '';

  selectable = false;
  selected = false;
  expanded = false;
  expandable = true;
  focused = false;

  children: Treenode[] = [];
  parent?: Treenode;
  loadChildren?: () => Observable<Treenode[]>;

  constructor(obj: Partial<Treenode>) {
    Object.assign(this, obj);
  }
}
