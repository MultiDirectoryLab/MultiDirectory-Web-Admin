export enum LdapNodeType {
    None = 0,
    Root = 1,
    Folder = 2,
    Server = 3,
    User = 4,
    Group = 5,
    OU = 6
}

export class EntityInfoResolver {
    static IconMap = new Map<LdapNodeType, string>([
        [ LdapNodeType.None, 'assets/folder.svg' ],
        [ LdapNodeType.Folder, 'assets/folder.svg'],
        [ LdapNodeType.Root, 'assets/snippet_folder.svg'],
        [ LdapNodeType.Server, 'assets/topic.svg'],
        [ LdapNodeType.User, 'assets/person.svg'],
        [ LdapNodeType.Group, 'assets/group.svg'],
        [ LdapNodeType.OU, 'assets/folder.svg'],
    ]);

    static TypeNameMap = new Map<LdapNodeType, string>([
        [ LdapNodeType.None, '' ],
        [ LdapNodeType.Folder, 'Каталог' ],
        [ LdapNodeType.Root, 'Корень' ],
        [ LdapNodeType.Server, 'Контроллер домена' ],
        [ LdapNodeType.User, 'Пользователь' ],
        [ LdapNodeType.Group, 'Группа безопасности' ],
        [ LdapNodeType.OU, 'Орагнизационная единица' ]
    ]);

    static TypeMap = new Map<string, LdapNodeType>([
        ['user', LdapNodeType.User],
        ['group', LdapNodeType.Group],
        ['organizationalUnit', LdapNodeType.OU]

    ]);

    static resolveIcon(type: LdapNodeType): string | undefined {
        return this.IconMap.get(type);
    }

    static resolveTypeName(type: LdapNodeType): string | undefined {
        return this.TypeNameMap.get(type);
    }

    static getNodeType(objectClass?: string[]): LdapNodeType | undefined {
        if(!objectClass || objectClass.length <= 0) {
            return undefined;
        }
        //objectClass?.vals.includes('user') ? LdapNodeType.User : LdapNodeType.Folder,
        for(let x of objectClass) {
            if(this.TypeMap.has(x))
                return this.TypeMap.get(x);
        }
        return LdapNodeType.Folder;
    }
}