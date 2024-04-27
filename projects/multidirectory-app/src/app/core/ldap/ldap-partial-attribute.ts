export class PartialAttribute {
  type: string = '';
  vals: string[] = [];

  constructor(obj: Partial<PartialAttribute>) {
    Object.assign(this, obj);
  }
}
