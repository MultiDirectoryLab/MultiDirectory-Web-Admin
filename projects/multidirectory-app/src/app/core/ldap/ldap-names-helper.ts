export class LdapNamesHelper {
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
    if (!dn) {
      return '';
    }
    const rawDnParts = dn.split(',').map((x) => x.trim().split('='));
    const dnParts = rawDnParts.map((element) => {
      return { type: element[0], value: element[1] };
    });
    dnParts.splice(1);
    return dnParts.map((x) => `${x.type}=${x.value}`).join(',');
  }

  static isDnChild(parentDn: string, childDn: string): boolean {
    if (parentDn == '' && childDn == '') {
      return true;
    }
    const childIncluded = childDn?.endsWith(parentDn) ?? false;
    const parentExcluded = childDn?.replace(parentDn, '') ?? '';
    return childIncluded && parentExcluded.split('=').length == 2;
  }
}
