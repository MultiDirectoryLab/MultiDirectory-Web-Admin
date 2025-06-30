import { SchemaResponseMetadata } from '../schema-response-metadata';
import { SchemaAttributeType } from './schema-attibute-type';

export class SchemaAttributeTypesResponse {
  metadata = new SchemaResponseMetadata({});
  items: SchemaAttributeType[] = [];
}
