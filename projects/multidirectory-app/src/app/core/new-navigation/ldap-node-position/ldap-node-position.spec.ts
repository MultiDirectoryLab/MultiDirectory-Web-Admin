import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapNodePosition } from './ldap-node-position';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('Ldap Node Position Tests', () => {
  const positionDn = 'cn=domain users,cn=groups,dc=md,dc=localhost,dc=dev';
  let position: LdapNodePosition;
  let multidirectoryApiServiceMock: MultidirectoryApiService;

  beforeEach(() => {
    multidirectoryApiServiceMock = getMultidirectoryApiMock();
    position = new LdapNodePosition(positionDn);
  });

  it('Should Return Parent', () => {
    const parentPosition = position.getParent();
    expect(parentPosition.dn).toEqual('cn=groups,dc=md,dc=localhost,dc=dev');

    const rootDsePosition = parentPosition.getParent();
    expect(rootDsePosition.dn).toEqual('dc=md,dc=localhost,dc=dev');

    const outofboundPosition = parentPosition.getParent().getParent().getParent();
    expect(outofboundPosition.dn).toBeFalsy();
  });

  it('Should Return Children', fakeAsync(async () => {
    const children = await position.getChildren(multidirectoryApiServiceMock);
    children.forEach((child) => {
      expect(child.getParent().dn).toEqual(positionDn);
    });
  }));

  it('Should Return Next Sibling', fakeAsync(async () => {
    const nextSibling = await position.getNextSibling(multidirectoryApiServiceMock);
    expect(nextSibling.dn).toEqual(
      'cn=readonly domain controllers,cn=groups,dc=md,dc=localhost,dc=dev',
    );
  }));

  it('Should Return Previous Sibling', fakeAsync(async () => {
    const previousSibling = await position.getPreviousSibling(multidirectoryApiServiceMock);
    expect(previousSibling.dn).toEqual('cn=domain admins,cn=groups,dc=md,dc=localhost,dc=dev');
  }));
});
