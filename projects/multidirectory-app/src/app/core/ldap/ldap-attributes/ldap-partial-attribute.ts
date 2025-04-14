export class PartialAttribute {
  type = '';
  vals: string[] = [];

  constructor(obj: Partial<PartialAttribute>) {
    Object.assign(this, obj);
  }
}
