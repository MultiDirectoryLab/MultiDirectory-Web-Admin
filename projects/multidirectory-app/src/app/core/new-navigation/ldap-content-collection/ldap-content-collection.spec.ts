import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapNodePosition } from '../ldap-node-position/ldap-node-position';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { LdapContentCollection } from './ldap-content-collection';

xdescribe('Ldap Content Collection Test', () => {
  const positionDn = 'cn=groups,dc=md,dc=localhost,dc=dev';
  let position: LdapNodePosition;
  let multidirectoryApiServiceMock: MultidirectoryApiService;
  let contentIterable: LdapContentCollection;

  beforeEach(() => {
    multidirectoryApiServiceMock = getMultidirectoryApiMock();
    position = new LdapNodePosition(positionDn);
    contentIterable = new LdapContentCollection(position);
  });
});
