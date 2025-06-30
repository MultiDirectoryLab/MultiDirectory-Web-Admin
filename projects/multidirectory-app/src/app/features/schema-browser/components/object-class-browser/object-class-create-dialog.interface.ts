import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';

export type ObjectClassCreateDialogReturnData = SchemaObjectClass | null;

export interface ObjectClassCreateDialogData {
  objectClass?: SchemaObjectClass;
}
