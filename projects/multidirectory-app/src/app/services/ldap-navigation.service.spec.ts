import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { LdapNavigationService } from "./ldap-navigation.service";
import { AccessPolicyNodeLoader } from "../core/navigation/node-loaders/access-policy-node-loader/access-policy-node-loader";
import { LdapTreeLoader } from "../core/navigation/node-loaders/ldap-node-loader/ldap-node-loader";
import { getAccessPolicyNodeLoaderMock } from "../testing/access-policy-node-loader-mock";
import { getLdapTreeLoaderMock } from "../testing/ldap-tree-loader-mock";
import { getMultidirectoryApiMock } from "../testing/multidirectory-api-mock.service";
import { MultidirectoryApiService } from "./multidirectory-api.service";
import { AppNavigationService } from "./app-navigation.service";

describe('LdapNavigationServiceTestSuit', () => {
    let ldapTreeLoader: LdapTreeLoader;
    let ldapNaviagtionService: LdapNavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AccessPolicyNodeLoader, useValue: getAccessPolicyNodeLoaderMock()},
                { provide: LdapTreeLoader, useValue: getLdapTreeLoaderMock()},
                { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock()},
                { provide: LdapNavigationService, useClass: LdapNavigationService },
            ]
        }).compileComponents()
    });

    beforeEach( () => {
        ldapTreeLoader = TestBed.inject(LdapTreeLoader);
        ldapNaviagtionService = TestBed.inject(LdapNavigationService);
    });

    it('Should return root DSE', () => {
        ldapTreeLoader.get().subscribe(nodes => {
            ldapNaviagtionService.setRootDse(nodes);
            let root = ldapNaviagtionService.getRootDse();
            root = ldapNaviagtionService.getRootDse();
            expect(root.length).toBeGreaterThan(0)
        });
    });

    it('goTo should select node', fakeAsync(async () => {
        ldapTreeLoader.get().subscribe(async nodes => {
            ldapNaviagtionService.setRootDse(nodes);
            await ldapNaviagtionService.goTo('cn=ldap-child-1,dc=test,dc=local');
            expect(ldapNaviagtionService.selectedCatalog?.id).toEqual('cn=ldap-child-1,dc=test,dc=local');

            await ldapNaviagtionService.goTo('dc=test,dc=local')
            expect(ldapNaviagtionService.selectedCatalog?.id).toEqual('dc=test,dc=local');

            await ldapNaviagtionService.goTo('cn=ldap-content-2,dc=test,dc=local')
            expect(ldapNaviagtionService.selectedCatalog?.id).toEqual('dc=test,dc=local');
            expect(ldapNaviagtionService.selectedEntity?.[0]?.id).toEqual('cn=ldap-content-2,dc=test,dc=local');
        });
    }));
})