import { DnPart } from '@models/core/ldap/distinguished-name';

export class LdapNamesHelper {
  static getDnParts(dn: string): DnPart[] {
    const rawDnParts = dn.split(',').map((x) => x.trim().split('='));
    const dnParts = rawDnParts.map((element) => {
      return { type: element[0], value: element[1] };
    });
    return dnParts;
  }

  static getDnParent(dn: string): string {
    if (!dn || dn.startsWith('dc=')) {
      return '';
    }
    const rawDnParts = dn.split(',').map((x) => x.trim().split('='));
    const dnParts = rawDnParts.map((element) => {
      return { type: element[0], value: element[1] };
    });
    dnParts.splice(0, 1);
    return dnParts.map((x) => `${x.type}=${x.value}`).join(',');
  }

  static getDnName(dn: string): string {
    const rawDnParts = dn.split(',').map((x) => x.trim().split('='));
    const dnParts = rawDnParts.map((element) => {
      return { type: element[0], value: element[1] };
    });
    dnParts.splice(1);
    return dnParts.map((x) => `${x.type}=${x.value}`).join(',');
  }

  static dnContain(left: DnPart[], right: DnPart[]) {
    const leftParts = left.map((x) => x.value);
    const rightParts = right.map((x) => x.value);
    return rightParts.every((x) => leftParts.includes(x));
  }

  static dnEqual(left: DnPart[], right: DnPart[]) {
    return left.map((x) => x.value).join('.') == right.map((x) => x.value).join('.');
  }
}
