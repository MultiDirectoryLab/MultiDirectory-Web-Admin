import { of } from "rxjs";
import { LdapTreeLoader } from "../core/navigation/node-loaders/ldap-node-loader/ldap-node-loader";
import { LdapEntity } from "../core/ldap/ldap-entity";
import { LdapEntityType } from "../core/ldap/ldap-entity-type";

export function getLdapTreeLoaderMock() {
    // Create jasmine spy object 
    let ldapTreeLoaderSpy = jasmine.createSpyObj(LdapTreeLoader, ['get', 'getContent', 'getChild']);
    const zeroLevelRoot = [
        new LdapEntity({
            id: 'dc=test,dc=local',
            selectable: true,
            route: ['/'],
            type: LdapEntityType.Root
        })
    ];
    let childFirstLevel = [
        new LdapEntity({
            id: 'cn=ldap-child-1,dc=test,dc=local',
            selectable: true,
            route: ['/'],
            parent: zeroLevelRoot[0],
            type: LdapEntityType.Folder
        }),
        new LdapEntity({
            id: 'cn=ldap-child-2,dc=test,dc=local',
            selectable: true,
            route: ['/'],
            parent: zeroLevelRoot[0],
            type: LdapEntityType.Folder
        })
    ];
    let contentFirstLevel = [
        new LdapEntity({
            id: 'cn=ldap-content-1,dc=test,dc=local',
            selectable: true,
            route: ['/'],
            parent: zeroLevelRoot[0],
            type: LdapEntityType.User
        }),
        new LdapEntity({
            id: 'cn=ldap-content-2,dc=test,dc=local',
            selectable: true,
            route: ['/'],
            parent: zeroLevelRoot[0],
            type: LdapEntityType.User
        })
    ];
    zeroLevelRoot[0].children = childFirstLevel;
    zeroLevelRoot[0].childCount = childFirstLevel.length;
    // Provide the dummy/mock data to sortNumberData method.
    ldapTreeLoaderSpy.get.and.returnValue(of(zeroLevelRoot));

    ldapTreeLoaderSpy.getChild.and.returnValue(of(childFirstLevel));

    ldapTreeLoaderSpy.getContent.and.returnValue(of(contentFirstLevel));
    return ldapTreeLoaderSpy;
}