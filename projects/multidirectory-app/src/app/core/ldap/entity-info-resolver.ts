import { LdapEntityType } from "./ldap-entity-type";

export class EntityInfoResolver {
    static IconMap = new Map<LdapEntityType, string>([
        [ LdapEntityType.None, 'assets/folder.svg' ],
        [ LdapEntityType.Folder, 'assets/folder.svg'],
        [ LdapEntityType.Root, 'assets/snippet_folder.svg'],
        [ LdapEntityType.Server, 'assets/topic.svg'],
        [ LdapEntityType.User, 'assets/person.svg'],
        [ LdapEntityType.Group, 'assets/group.svg'],
        [ LdapEntityType.OU, 'assets/folder.svg'],
    ]);

    static TypeNameMap = new Map<LdapEntityType, string>([
        [ LdapEntityType.None, '' ],
        [ LdapEntityType.Folder, 'Каталог' ],
        [ LdapEntityType.Root, 'Корень' ],
        [ LdapEntityType.Server, 'Контроллер домена' ],
        [ LdapEntityType.User, 'Пользователь' ],
        [ LdapEntityType.Group, 'Группа безопасности' ],
        [ LdapEntityType.OU, 'Организационная единица' ]
    ]);

    static TypeMap = new Map<string, LdapEntityType>([
        ['user', LdapEntityType.User],
        ['group', LdapEntityType.Group],
        ['organizationalUnit', LdapEntityType.OU]

    ]);

    static resolveIcon(type: LdapEntityType): string | undefined {
        return this.IconMap.get(type);
    }

    static resolveTypeName(type: LdapEntityType): string | undefined {
        return this.TypeNameMap.get(type);
    }

    static getNodeType(objectClass?: string[]): LdapEntityType | undefined {
        if(!objectClass || objectClass.length <= 0) {
            return undefined;
        }
        //objectClass?.vals.includes('user') ? LdapNodeType.User : LdapNodeType.Folder,
        for(let x of objectClass) {
            if(this.TypeMap.has(x))
                return this.TypeMap.get(x);
        }
        return LdapEntityType.Folder;
    }

    static isExpandable(objectClass?: string[]) {
        return objectClass?.includes('container') || objectClass?.includes('builtinDomain');
    }
}