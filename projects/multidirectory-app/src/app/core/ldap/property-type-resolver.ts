export enum LdapPropertyType {
    String = 'String',
    Integer = 'Integer',
    MultivaluedString = 'MultivaluedString'
}
export interface LdapPropertyDescription {
    id: string;
    description?: string;
    type: LdapPropertyType
}
const LdapPropertyTypeMap: LdapPropertyDescription[] = [
    { id: '1.3.6.1.4.1.1466.115.121.1.15', description: 'Directory String', type: LdapPropertyType.String },
    { id: '1.3.6.1.4.1.1466.115.121.1.38', description: 'Multivalued String', type: LdapPropertyType.MultivaluedString }
]

export class PropertyTypeResolver {
    static getPropertyType(oid: string): LdapPropertyType | undefined {
        const result = LdapPropertyTypeMap.find(x => x.id == oid);
        if(!result) {
            return undefined;
        }
        return result.type;
    }
}