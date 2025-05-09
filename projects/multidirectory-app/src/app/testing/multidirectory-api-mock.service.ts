import { of } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LoginResponse } from '@models/login/login-response';
import { SearchRequest } from '@models/entry/search-request';
import { MockedSchema, MockedTree } from './scheme/mocked-schema';

export function getMultidirectoryApiMock() {
  // Create jasmine spy object
  const multidirectoryApiServiceMock = jasmine.createSpyObj(MultidirectoryApiService, [
    'login',
    'search',
    'getAccessPolicy',
    'editAccessPolicy',
  ]);

  // Provide the dummy/mock data to sortNumberData method.
  const loginResponse = {
    access_token: 'xxx',
    refresh_token: 'xxx',
    type: 'user',
  } as LoginResponse;
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
