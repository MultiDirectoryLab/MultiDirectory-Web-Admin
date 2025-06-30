import { SchemaEntity } from '@models/api/schema/entities/schema-entity';

export type SchemaEntityDetailsDialogReturnData = string | null;

export interface SchemaEntityDetailsDialogData {
  entity: SchemaEntity;
}
