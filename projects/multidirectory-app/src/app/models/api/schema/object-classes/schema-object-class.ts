import { SchemaAttributeType } from '../attribute-types/schema-attibute-type';

export declare type SchemaObjectClassKind = 'STRUCTURAL' | 'AUXILARY' | 'ABSTRACT';

export class SchemaObjectClass extends SchemaAttributeType {
  superior_name = '';
  kind: SchemaObjectClassKind = 'STRUCTURAL';
  attribute_type_names_must: string[] = [];
  attribute_type_names_may: string[] = [];

  constructor(obj: Partial<SchemaObjectClass>) {
    super(obj);
    Object.assign(this, obj);
  }
}
