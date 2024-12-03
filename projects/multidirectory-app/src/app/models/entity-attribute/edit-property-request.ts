import { EntityAttributeType } from '@core/entity-attributes/entity-attribute-type';

export class EditPropertyRequest {
  propertyType: EntityAttributeType = EntityAttributeType.String;
  propertyName: string = '';
  propertyValue: any[] = [];

  constructor(obj: Partial<EditPropertyRequest>) {
    Object.assign(this, obj);
  }
}
