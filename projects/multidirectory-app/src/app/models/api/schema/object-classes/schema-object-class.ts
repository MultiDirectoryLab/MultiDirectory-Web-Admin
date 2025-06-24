export declare type SchemaObjectClassKind = 'STRUCTURAL' | 'AUXILARY' | 'ABSTRACT';

export class SchemaObjectClass {
  oid = '';
  name = '';
  superior_name = '';
  kind: SchemaObjectClassKind = 'STRUCTURAL';
  is_system = true;
  attribute_type_names_must: string[] = [];
  attribute_type_names_may: string[] = [];
}
