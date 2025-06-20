export class ModifyDnRequest {
  entry = '';
  newrdn = '';
  deleteoldrdn = true;
  new_superior = '';

  constructor(obj?: Partial<ModifyDnRequest>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
