import { of } from 'rxjs';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { NavigationNode } from '@models/core/ldap/ldap-entity';
import { LdapEntryType } from '@models/core/ldap/ldap-entry-type';

export function getLdapTreeLoaderMock() {
  // Create jasmine spy object
  const ldapTreeLoaderSpy = jasmine.createSpyObj(LdapEntryLoader, [
    'get',
    'getContent',
    'getChild',
  ]);
  const zeroLevelRoot = [
    new NavigationNode({
      id: 'dc=test,dc=local',
      selectable: true,
      route: ['/'],
      type: LdapEntryType.Root,
    }),
  ];
  const childFirstLevel = [
    new NavigationNode({
      id: 'cn=ldap-child-1,dc=test,dc=local',
      selectable: true,
      route: ['/'],
      parent: zeroLevelRoot[0],
      type: LdapEntryType.Folder,
    }),
    new NavigationNode({
      id: 'cn=ldap-child-2,dc=test,dc=local',
      selectable: true,
      route: ['/'],
      parent: zeroLevelRoot[0],
      type: LdapEntryType.Folder,
    }),
  ];
  const contentFirstLevel = [
    new NavigationNode({
      id: 'cn=ldap-content-1,dc=test,dc=local',
      selectable: true,
      route: ['/'],
      parent: zeroLevelRoot[0],
      type: LdapEntryType.User,
    }),
    new NavigationNode({
      id: 'cn=ldap-content-2,dc=test,dc=local',
      selectable: true,
      route: ['/'],
      parent: zeroLevelRoot[0],
      type: LdapEntryType.User,
    }),
  ];
  zeroLevelRoot[0].children = childFirstLevel;
  //zeroLevelRoot[0].childCount = childFirstLevel.length;
  // Provide the dummy/mock data to sortNumberData method.
  ldapTreeLoaderSpy.get.and.returnValue(of(zeroLevelRoot));

  ldapTreeLoaderSpy.getChild.and.returnValue(of(childFirstLevel));

  ldapTreeLoaderSpy.getContent.and.returnValue(of(contentFirstLevel));
  return ldapTreeLoaderSpy;
}
