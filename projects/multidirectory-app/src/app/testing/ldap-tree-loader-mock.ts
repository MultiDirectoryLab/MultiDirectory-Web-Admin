import { of } from "rxjs";
import { LdapTreeLoader } from "../core/navigation/node-loaders/ldap-tree-loader/ldap-tree-loader";
import { LdapEntity } from "../core/ldap/ldap-entity";

export function getLdapTreeLoaderMock() {
    // Create jasmine spy object 
    let ldapTreeLoaderSpy = jasmine.createSpyObj(LdapTreeLoader, ['get']);
    // Provide the dummy/mock data to sortNumberData method.
    ldapTreeLoaderSpy.get.and.returnValue(of([
        new LdapEntity({
            id: 'ldap-root'
        })
    ]));
    return ldapTreeLoaderSpy;
}