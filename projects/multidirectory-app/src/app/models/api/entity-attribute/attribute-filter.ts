export class AttributeFilter {
  showWithValuesOnly = true;
  showWritableOnly = false;

  constructor(obj?: Partial<AttributeFilter>) {
    Object.assign(this, obj);
  }
}
