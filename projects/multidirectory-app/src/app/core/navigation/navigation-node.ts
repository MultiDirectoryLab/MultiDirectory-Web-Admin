import { Treenode } from 'multidirectory-ui-kit';

export class NavigationNode extends Treenode {
  override parent?: NavigationNode;
  icon = '';
  route: any[] = [];
  data: any;
  constructor(obj: Partial<NavigationNode>) {
    super({});
    Object.assign(this, obj);
  }
}
