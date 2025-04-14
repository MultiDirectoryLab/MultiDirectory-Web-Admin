export class GroupSelection {
  dn = '';
  name = '';
  selected = false;
  constructor(obj: Partial<GroupSelection>) {
    Object.assign(this, obj);
  }
}
