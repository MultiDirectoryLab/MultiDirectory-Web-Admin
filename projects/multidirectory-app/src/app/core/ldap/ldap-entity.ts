import { Treenode } from "multidirectory-ui-kit";
import { LdapEntityType } from "./ldap-entity-type";
import { SearchEntry } from "../../models/entry/search-response";
import { EntityInfoResolver } from "./entity-info-resolver";

export class LdapEntity extends Treenode {
    override parent: LdapEntity | null = null;

    type: LdapEntityType = LdapEntityType.None;
    entry?: SearchEntry;
    icon?: string;
    childCount?: number;
    expandable = true;
    constructor(obj: Partial<LdapEntity>) {
        super({});
        Object.assign(this, obj);
        this.icon = EntityInfoResolver.resolveIcon(this.type);
    }
}
