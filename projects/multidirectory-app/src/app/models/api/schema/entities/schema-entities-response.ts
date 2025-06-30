import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaResponseMetadata } from '../schema-response-metadata';

export class SchemaEntitiesResponse {
  metadata = new SchemaResponseMetadata({});
  items: SchemaEntity[] = [];
}
