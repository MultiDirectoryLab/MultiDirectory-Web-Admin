import { SchemaResponseMetadata } from '../schema-response-metadata';
import { SchemaObjectClass } from './schema-object-class';

export class SchemaObjectClassResponse {
  metadata = new SchemaResponseMetadata({});
  items: SchemaObjectClass[] = [];
}
