import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';

export type ObjectClassPropertiesDialogReturnData = SchemaObjectClass | null;

export interface ObjectClassPropertiesDialogData {
  objectClass?: SchemaObjectClass;
}
