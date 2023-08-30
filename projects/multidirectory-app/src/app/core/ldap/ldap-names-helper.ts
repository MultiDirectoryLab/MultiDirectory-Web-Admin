import { DnPart } from "./distinguished-name";

export class LdapNamesHelper {
    static getDnParts(dn: string): DnPart[] {
        const rawDnParts = dn.split(',').map(x => x.trim().split('='));
        const dnParts = rawDnParts.map(element => {
            return { type: element[0], value: element[1]};
        });
        return dnParts;
    }

    static dnContain(left: DnPart[], right: DnPart[]) {
        const leftParts = left.map(x => x.value);
        const rightParts = right.map(x => x.value); 
        return  rightParts.every(x => leftParts.includes(x));
    }

    static dnEqual(left: DnPart[], right: DnPart[]) {
        return left.map(x => x.value).join('.') == right.map(x => x.value).join('.');
    }
}