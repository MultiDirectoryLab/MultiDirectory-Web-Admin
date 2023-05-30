export enum LdapNodeType {
    None = 0,
    Root = 1,
    Folder = 2,
    Server = 3,
    Person = 4
}

export class IconResolver {
    static Map = new Map<LdapNodeType, string>([
        [ LdapNodeType.None, 'assets/folder.svg' ],
        [ LdapNodeType.Folder, 'assets/folder.svg'],
        [ LdapNodeType.Root, 'assets/snippet_folder.svg'],
        [ LdapNodeType.Server, 'assets/topic.svg'],
        [ LdapNodeType.Person, 'assets/person.svg']
    ]);

    static resolveIcon(type: LdapNodeType): string | undefined {
        return this.Map.get(type);
    }
}