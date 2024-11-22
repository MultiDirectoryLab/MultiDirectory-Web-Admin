import { of } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LoginResponse } from '@models/login/login-response';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { SearchRequest } from '@models/entry/search-request';
import { MockedSchema, MockedTree } from './mocked-schema';
import { SearchEntry, SearchResponse } from '@models/entry/search-response';

export function getMultidirectoryApiMock() {
  // Create jasmine spy object
  let multidirectoryApiServiceMock = jasmine.createSpyObj(MultidirectoryApiService, [
    'login',
    'search',
    'getAccessPolicy',
    'editAccessPolicy',
  ]);

  // Provide the dummy/mock data to sortNumberData method.
  const loginResponse = <LoginResponse>{ access_token: 'xxx', refresh_token: 'xxx', type: 'user' };
  multidirectoryApiServiceMock.login.and.returnValue(of(loginResponse));
  multidirectoryApiServiceMock.search.and.callFake((request: SearchRequest) => {
    if (request.base_object.includes('CN=Schema')) {
      return of(MockedSchema);
    }

    return of(MockedTree);
  });

  return multidirectoryApiServiceMock;
}

/**
 * .returnValue(
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
  )
 */
