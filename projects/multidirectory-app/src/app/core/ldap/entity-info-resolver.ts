import { translate } from "@ngneat/transloco";
import { LdapEntryType } from "./ldap-entity-type";
import { LdapEntryNode } from "./ldap-entity";

export class EntityInfoResolver {
    private static IconMap = new Map<LdapEntryType, string>([
        [ LdapEntryType.None, 'assets/folder.svg' ],
        [ LdapEntryType.Folder, 'assets/folder.svg'],
        [ LdapEntryType.Root, 'assets/snippet_folder.svg'],
        [ LdapEntryType.Server, 'assets/topic.svg'],
        [ LdapEntryType.User, 'assets/person.svg'],
        [ LdapEntryType.Group, 'assets/group.svg'],
        [ LdapEntryType.OU, 'assets/folder.svg'],
    ]);

    private static TypeNameMap = new Map<LdapEntryType, () => string>([
        [ LdapEntryType.None, () =>  '' ],
        [ LdapEntryType.Folder, () => translate('entity-info-resolver.catalog') ],
        [ LdapEntryType.Root,  () => translate('entity-info-resolver.root') ],
        [ LdapEntryType.Server,  () => translate('entity-info-resolver.domain-controller') ],
        [ LdapEntryType.User,  () => translate('entity-info-resolver.user')],
        [ LdapEntryType.Group,  () => translate('entity-info-resolver.security-group')],
        [ LdapEntryType.OU,  () => translate('entity-info-resolver.organizational-unit') ]
    ]);

    private static TypeMap = new Map<string, LdapEntryType>([
        ['user', LdapEntryType.User],
        ['group', LdapEntryType.Group],
        ['organizationalUnit', LdapEntryType.OU]

    ]);

    static resolveIcon(type: LdapEntryType): string {
        return this.IconMap.get(type) ?? '';
    }

    static resolveTypeName(type: LdapEntryType): string {
        return this.TypeNameMap.get(type)?.() ?? '';
    }

    static getNodeType(objectClass: string[]): LdapEntryType {
        if(objectClass.length <= 0) {
            return LdapEntryType.None;
        }
        
        for(let x of objectClass) {
            if(this.TypeMap.has(x))
                return this.TypeMap.get(x) ?? LdapEntryType.None;
        }
        return LdapEntryType.Folder;
    }

    static isExpandable(objectClass?: string[]) {
        return objectClass?.includes('container') || objectClass?.includes('builtinDomain');
    }

    static getNodeDescription(entry: LdapEntryNode) {
        const attrIndex = entry.entry?.partial_attributes?.findIndex(x => x.type == 'description') ?? -1;
        return attrIndex > -1 ? entry.entry!.partial_attributes[attrIndex].vals[0] : '';
    }
}