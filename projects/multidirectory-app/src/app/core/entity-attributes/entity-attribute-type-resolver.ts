import { EntityAttributeDescriptor } from './entity-attribute-descriptor';
import { EntityAttributeTypeMap } from './entity-attribute-type-map';

export class EntityAttributeTypeResolver {
  static getPropertyDescription(oid: string | null): EntityAttributeDescriptor | undefined {
    if (!oid) {
      return EntityAttributeTypeMap[0];
    }
    const result = EntityAttributeTypeMap.find((x) => x.id == oid);
    if (!result) {
      return undefined;
    }
    return result;
  }

  static getDefault(): EntityAttributeDescriptor {
    return EntityAttributeTypeMap[0];
  }
}
