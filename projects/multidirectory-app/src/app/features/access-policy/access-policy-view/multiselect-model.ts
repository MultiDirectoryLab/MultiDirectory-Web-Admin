export class MultiselectModel {
  id = '';
  title = '';
  badge_title?: string;
  selected = false;
  key = '';

  constructor(obj: Partial<MultiselectModel>) {
    Object.assign(this, obj);
  }
}
