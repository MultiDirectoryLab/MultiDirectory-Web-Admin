export class ModifyDnRequest {
  entry: string = '';
  newrdn: string = '';
  deleteoldrdn: boolean = true;
  new_superior: string = '';

  constructor(obj?: Partial<ModifyDnRequest>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
