import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';

export type AttributeDetailsDialogReturnData = SchemaAttributeType;

export interface AttributeDetailsDialogData {
  attribute?: SchemaAttributeType;
  edit: boolean;
}
