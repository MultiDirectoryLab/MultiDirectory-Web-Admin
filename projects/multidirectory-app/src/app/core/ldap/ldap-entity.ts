import { LdapEntityType } from "./ldap-entity-type";
import { SearchEntry } from "../../models/entry/search-response";
import { EntityInfoResolver } from "./entity-info-resolver";
import { NavigationNode } from "../navigation/navigation-node";

export class LdapEntity extends NavigationNode {
    override parent?: LdapEntity;
    type: LdapEntityType = LdapEntityType.None;
    entry?: SearchEntry;
    childCount?: number;
    expandable = true;
    clickAction?: ((node: LdapEntity)=>void) = undefined;

    constructor(obj: Partial<LdapEntity>) {
        super({});
        Object.assign(this, obj);
        this.icon = EntityInfoResolver.resolveIcon(this.type);
    }
}
