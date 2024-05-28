export enum LdapPropertyType {
  String = 'String',
  Integer = 'Integer',
  MultivaluedString = 'MultivaluedString',
}
export interface LdapPropertyDescription {
  id: string;
  description?: string;
  type: LdapPropertyType;
  isArray: boolean;
}
const LdapPropertyTypeMap: LdapPropertyDescription[] = [
  { id: '', description: 'Directory String', type: LdapPropertyType.String, isArray: false },
  {
    id: '1.3.6.1.4.1.1466.115.121.1.15',
    description: 'Directory String',
    type: LdapPropertyType.String,
    isArray: false,
  },
  {
    id: '1.3.6.1.4.1.1466.115.121.1.38',
    description: 'Multivalued String',
    type: LdapPropertyType.MultivaluedString,
    isArray: true,
  },
];

export class PropertyTypeResolver {
  static getPropertyDescription(oid: string): LdapPropertyDescription | undefined {
    const result = LdapPropertyTypeMap.find((x) => x.id == oid);
    if (!result) {
      return undefined;
    }
    return result;
  }

  static getDefault(): LdapPropertyDescription {
    return LdapPropertyTypeMap[0];
  }
}
