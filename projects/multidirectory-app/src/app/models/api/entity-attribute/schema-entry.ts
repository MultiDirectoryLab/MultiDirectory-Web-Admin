import { EntityAttributeType } from '@core/entity-attributes/entity-attribute-type';
import { EntityAttributeTypeResolver } from '@core/entity-attributes/entity-attribute-type-resolver';

export class SchemaEntry {
  name = '';
  writable = true;
  syntax = '';
  type: EntityAttributeType = EntityAttributeType.String;

  constructor(obj: Partial<SchemaEntry>) {
    Object.assign(this, obj);
    const propertyDescription =
      EntityAttributeTypeResolver.getPropertyDescription(this.syntax) ||
      EntityAttributeTypeResolver.getDefault();
    this.type = propertyDescription.type;
  }
}
