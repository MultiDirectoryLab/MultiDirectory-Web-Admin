import { SchemaEntityObjectClass } from './schema-entity-object-class';

export class SchemaEntity {
  name: string = '';
  is_system: boolean = true;
  object_class_names: string[] = [];

  constructor(obj: Partial<SchemaEntity>) {
    Object.assign(this, obj);
  }
}
