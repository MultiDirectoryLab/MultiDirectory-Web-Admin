export enum LdapNodeType {
    None = 0,
    Root = 1,
    Folder = 2,
    Server = 3
}

export class IconResolver {
    static Map = new Map<LdapNodeType, string>([
        [ LdapNodeType.None, 'assets/folder.svg' ],
        [ LdapNodeType.Folder, 'assets/folder.svg'],
        [ LdapNodeType.Root, 'assets/snippet_folder.svg'],
        [ LdapNodeType.Server, 'assets/topic.svg']
    ]);

    static resolveIcon(type: LdapNodeType): string | undefined {
        return this.Map.get(type);
    }
}