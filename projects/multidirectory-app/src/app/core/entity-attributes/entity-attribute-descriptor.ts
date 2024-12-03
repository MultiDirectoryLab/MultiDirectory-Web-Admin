import { EntityAttributeType } from './entity-attribute-type';

export interface EntityAttributeDescriptor {
  id: string;
  description?: string;
  type: EntityAttributeType;
  isArray: boolean;
}
