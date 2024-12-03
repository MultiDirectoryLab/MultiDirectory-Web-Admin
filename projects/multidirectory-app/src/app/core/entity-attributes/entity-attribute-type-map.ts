import { EntityAttributeDescriptor } from './entity-attribute-descriptor';
import { EntityAttributeType } from './entity-attribute-type';

export const EntityAttributeTypeMap: EntityAttributeDescriptor[] = [
  { id: '', description: 'Directory String', type: EntityAttributeType.String, isArray: false },
  {
    id: '1.3.6.1.4.1.1466.115.121.1.15',
    description: 'Directory String',
    type: EntityAttributeType.String,
    isArray: false,
  },
  {
    id: '1.3.6.1.4.1.1466.115.121.1.38',
    description: 'Multivalued String',
    type: EntityAttributeType.MultivaluedString,
    isArray: true,
  },
];
