import { translate } from '@jsverse/transloco';
import { LdapEntry } from '@models/core/ldap/ldap-entry';
import { LdapEntryType } from '@models/core/ldap/ldap-entry-type';
import BitSet from 'bitset';
import { UserAccountControlFlag } from './user-account-control-flags';
import { PipeTransform } from '@angular/core';
import { LdapBrowserEntry } from '@models/core/ldap-browser/ldap-browser-entry';

export class EntityInfoResolver {
  private static IconMap = new Map<LdapEntryType, string>([
    [LdapEntryType.None, 'assets/folder.svg'],
    [LdapEntryType.Folder, 'assets/folder.svg'],
    [LdapEntryType.Root, 'assets/snippet_folder.svg'],
    [LdapEntryType.Server, 'assets/topic.svg'],
    [LdapEntryType.User, 'assets/person.svg'],
    [LdapEntryType.Group, 'assets/group.svg'],
    [LdapEntryType.OU, 'assets/folder.svg'],
    [LdapEntryType.Computer, 'assets/computer.svg'],
    [LdapEntryType.Rule, 'assets/rule.svg'],
    [LdapEntryType.KrbPrincipal, 'assets/rule.svg'],
  ]);

  private static TypeNameMap = new Map<LdapEntryType, () => string>([
    [LdapEntryType.None, () => ''],
    [LdapEntryType.Folder, () => translate('entity-info-resolver.catalog')],
    [LdapEntryType.Root, () => translate('entity-info-resolver.root')],
    [LdapEntryType.Server, () => translate('entity-info-resolver.domain-controller')],
    [LdapEntryType.User, () => translate('entity-info-resolver.user')],
    [LdapEntryType.Group, () => translate('entity-info-resolver.security-group')],
    [LdapEntryType.OU, () => translate('entity-info-resolver.organizational-unit')],
    [LdapEntryType.Computer, () => translate('entity-info-resolver.computer')],
    [LdapEntryType.Rule, () => translate('entity-info-resolver.rule')],
    [LdapEntryType.KrbPrincipal, () => translate('entity-info-resolver.rule')],
  ]);

  private static TypeMap = new Map<string, LdapEntryType>([
    ['user', LdapEntryType.User],
    ['group', LdapEntryType.Group],
    ['organizationalUnit', LdapEntryType.OU],
    ['computer', LdapEntryType.Computer],
    ['sudoRole', LdapEntryType.Rule],
    ['krbprincipal', LdapEntryType.KrbPrincipal],
  ]);

  static resolveIcon(type: LdapEntryType): string {
    return this.IconMap.get(type) ?? '';
  }

  static resolveTypeName(type: LdapEntryType): string {
    return this.TypeNameMap.get(type)?.() ?? '';
  }

  static getNodeType(objectClass: string[] | undefined): LdapEntryType {
    if (!objectClass || objectClass.length <= 0) {
      return LdapEntryType.None;
    }

    for (const x of objectClass) {
      if (this.TypeMap.has(x)) return this.TypeMap.get(x) ?? LdapEntryType.None;
    }
    return LdapEntryType.Folder;
  }

  static expandableClasses = ['container', 'krbContainer', 'krbrealmcontainer', 'builtinDomain'];
  static isExpandable(objectClass?: string[]) {
    return objectClass?.some((x) => EntityInfoResolver.expandableClasses.includes(x));
  }

  static getNodeDescription(entry: LdapEntry) {
    const descriptionAttirbute = entry.getAttibute('description');
    return descriptionAttirbute?.[0] ?? '';
  }

  static getNodeStatus(entry: LdapEntry): string {
    const uacAttirbute = entry.getAttibute('userAccountControl');
    if (!uacAttirbute?.[0]) {
      return '';
    }
    const uacBitSet = BitSet.fromHexString(Number(uacAttirbute[0]).toString(16));

    const enabled = (Number(uacBitSet) & UserAccountControlFlag.ACCOUNTDISABLE) > 0 ? false : true;
    return enabled
      ? translate('entity-info-resolver.enabled')
      : translate('entity-info-resolver.disabled');
  }
}

export class LdapEntryTypePipe implements PipeTransform {
  transform(value: LdapEntryType, ...args: any[]) {
    return EntityInfoResolver.resolveTypeName(value);
  }
}

export class LdapEntryDescriptionPipe implements PipeTransform {
  transform(value: LdapBrowserEntry, ...args: any[]) {
    const descriptionAttirbute = value?.attributes?.find((x) => x.type == 'description');
    return descriptionAttirbute?.vals?.[0] ?? '';
  }
}

export class LdapEntryStatusPipe implements PipeTransform {
  transform(value: LdapBrowserEntry, ...args: any[]) {
    const uacAttirbute = value?.attributes?.find((x) => x.type == 'userAccountControl');
    if (!uacAttirbute?.vals?.[0]) {
      return '';
    }
    const uacBitSet = BitSet.fromHexString(Number(uacAttirbute.vals[0]).toString(16));

    const enabled = (Number(uacBitSet) & UserAccountControlFlag.ACCOUNTDISABLE) > 0 ? false : true;
    return enabled
      ? translate('entity-info-resolver.enabled')
      : translate('entity-info-resolver.disabled');
  }
}
