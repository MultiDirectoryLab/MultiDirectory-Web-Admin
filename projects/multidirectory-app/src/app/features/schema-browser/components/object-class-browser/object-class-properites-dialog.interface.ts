import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';

export type ObjectClassPropertiesDialogReturnData = string | null;

export interface ObjectClassPropertiesDialogData {
  objectClass?: SchemaObjectClass;
}
