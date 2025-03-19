export class NavigationNode {
  name: string = '';
  id: string = '';
  selectable = false;
  selected = false;
  expandable = false;
  route: string[] = [];
  routeData: { [key: string]: string } = {};
  constructor(obj: Partial<NavigationNode>) {
    Object.assign(this, obj);
  }
}
