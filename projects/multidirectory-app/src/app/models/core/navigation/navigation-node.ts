import { Treenode } from 'multidirectory-ui-kit';

export class NavigationNode extends Treenode {
  route: string[] = [];
  routeData: { [key: string]: string } = {};
  constructor(obj: Partial<NavigationNode>) {
    super(obj);
    Object.assign(this, obj);
  }
}
