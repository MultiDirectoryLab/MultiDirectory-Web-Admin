export class SchemaAttributeType {
  oid: string = '';
  name: string = '';
  syntax: string = '';
  single_value: boolean = true;
  no_user_modification = false;
  is_system = true;

  constructor(obj: Partial<SchemaAttributeType>) {
    Object.assign(this, obj);
  }
}
