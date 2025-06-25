import { SchemaEntity } from '@models/api/schema/entities/schema-entity';

export type EntityDetailsDialogReturnData = string | null;

export interface EntityDetailsDialogData {
  entity: SchemaEntity;
}
