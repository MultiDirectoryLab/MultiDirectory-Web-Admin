import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { LdapNavigationService } from './ldap-navigation.service';
import { fakeAsync } from '@angular/core/testing';

describe('Ldap Navigation Service', () => {
  const api = getMultidirectoryApiMock();
  let naviagtionService = new LdapNavigationService(api);
  it('Should Get Root Dse', fakeAsync(async () => {
    const rootDse = await naviagtionService.getRootDse();
    expect(rootDse.length).toEqual(1);
    expect(rootDse[0].dn).toBe('dc=md,dc=localhost,dc=dev');
  }));

  it('Should get children', fakeAsync(async () => {
    const rootDse = await naviagtionService.getRootDse();
    expect(rootDse.length).toEqual(1);
    expect(rootDse[0].dn).toBe('dc=md,dc=localhost,dc=dev');
    const children = await rootDse[0].getChildren(api);
    expect(children.length).toBeGreaterThan(2);
  }));
});
