import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';

export type ObjectClassAttributeEditorDialogReturnData = string | null;

export interface ObjectClassAttributeEditorDialogData {
  objectClass?: SchemaObjectClass;
}
