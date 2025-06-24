import { of } from 'rxjs';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LoginResponse } from '@models/api/login/login-response';
import { SearchRequest } from '@models/api/entry/search-request';
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
    if (request.base_object == '' && request.scope == 0) {
      const result = Object.assign({}, MockedTree);
      const foundEntries = [result.search_result[0]];
      result.search_result = foundEntries;
      return of(result);
    }
    if (request.scope == 1) {
      const result = Object.assign({}, MockedTree);
      const foundEntries = result.search_result.filter(
        (x) =>
          x.object_name.endsWith(request.base_object) &&
          x.object_name.length > request.base_object.length,
      );
      result.search_result = foundEntries;
      return of(result);
    }
    return of(MockedTree);
  });

  return multidirectoryApiServiceMock;
}

/**
 * .returnValue(
    of([
      new NavigationNode({
        id: 'search-result-1',
      }),
      new NavigationNode({
        id: 'search-result-2',
      }),
      new NavigationNode({
        id: 'search-result-3',
      }),
    ]),
  )
 */
