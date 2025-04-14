import { of } from 'rxjs';
import { NavigationNode } from '@core/navigation/navigation-node';

export function getPasswordPolicyLoaderMock() {
  const accessPolicyLoaderSpy = jasmine.createSpyObj(getPasswordPolicyLoaderMock, ['get']);
  // Provide the dummy/mock data to sortNumberData method.
  accessPolicyLoaderSpy.get.and.returnValue(
    of([
      new NavigationNode({
        id: 'password-policy-root',
        selectable: true,
        route: ['password-policy'],
      }),
    ]),
  );
  return accessPolicyLoaderSpy;
}
