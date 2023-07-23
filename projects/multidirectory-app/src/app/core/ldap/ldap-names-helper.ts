import { DnPart } from "./ldap-loader";

export class LdapNamesHelper {
    static getDnParts(dn: string): DnPart[] {
        const rawDnParts = dn.split(',').map(x => x.trim().split('='));
        const dnParts = rawDnParts.map(element => {
            return { type: element[0], value: element[1]};
        });
        return dnParts;
    }

    static dnContain(left: DnPart[], right: DnPart[]) {
        return left.map(x => x.value).join('.').includes(right.map(x => x.value).join('.'));
    }

    static dnEqual(left: DnPart[], right: DnPart[]) {
        return left.map(x => x.value).join('.') == right.map(x => x.value).join('.');
    }
}