import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';

export type ObjectClassCreateDialogReturnData = string | null;

export interface ObjectClassCreateDialogData {
  objectClass?: SchemaObjectClass;
}
