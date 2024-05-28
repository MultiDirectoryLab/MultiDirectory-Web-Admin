import { of } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LoginResponse } from '@models/login/login-response';
import { LdapEntryNode } from '@core/ldap/ldap-entity';

export function getMultidirectoryApiMock() {
  // Create jasmine spy object
  let multidirectoryApiServiceMock = jasmine.createSpyObj(MultidirectoryApiService, [
    'login',
    'search',
  ]);
  // Provide the dummy/mock data to sortNumberData method.
  const loginResponse = <LoginResponse>{ access_token: 'xxx', refresh_token: 'xxx', type: 'user' };
  multidirectoryApiServiceMock.login.and.returnValue(of(loginResponse));
  multidirectoryApiServiceMock.search.and.returnValue(
    of([
      new LdapEntryNode({
        id: 'search-result-1',
      }),
      new LdapEntryNode({
        id: 'search-result-2',
      }),
      new LdapEntryNode({
        id: 'search-result-3',
      }),
    ]),
  );

  return multidirectoryApiServiceMock;
}
