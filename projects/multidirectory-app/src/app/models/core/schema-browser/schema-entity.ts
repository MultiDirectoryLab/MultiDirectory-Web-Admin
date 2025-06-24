export class SchemaEntity {
  name: string = '';

  constructor(obj: Partial<SchemaEntity>) {
    Object.assign(this, obj);
  }
}
