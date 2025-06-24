import { of } from 'rxjs';
import { AccessPolicyNodeLoader } from '@core/navigation/node-loaders/policy-loaders/access-policy-node-loader/access-policy-node-loader';
import { NavigationNode } from '@models/core/navigation/navigation-node';

export function getAccessPolicyNodeLoaderMock() {
  // Create jasmine spy object
  const accessPolicyLoaderSpy = jasmine.createSpyObj(AccessPolicyNodeLoader, ['get']);
  // Provide the dummy/mock data to sortNumberData method.
  accessPolicyLoaderSpy.get.and.returnValue(
    of([
      new NavigationNode({
        id: 'access-policy-root',
        selectable: true,
        route: ['access-policy'],
      }),
    ]),
  );
  return accessPolicyLoaderSpy;
}
