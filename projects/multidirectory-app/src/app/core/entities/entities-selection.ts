export class GroupSelection {
  dn: string = '';
  name: string = '';
  selected = false;
  constructor(obj: Partial<GroupSelection>) {
    Object.assign(this, obj);
  }
}
