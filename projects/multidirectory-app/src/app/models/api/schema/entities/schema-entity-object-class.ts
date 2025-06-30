export class SchemaEntityObjectClass {
  name: string = '';

  constructor(obj: Partial<SchemaEntityObjectClass>) {
    Object.assign(this, obj);
  }
}
