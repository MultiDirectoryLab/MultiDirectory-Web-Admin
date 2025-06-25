import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';

export type AttributeDetailsDialogReturnData = string | null;

export interface AttributeDetailsDialogData {
  attribute?: SchemaAttributeType;
}
