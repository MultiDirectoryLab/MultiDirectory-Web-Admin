import { LdapPropertiesService } from '@services/ldap-properties.service';
import { ShortMockedSchema } from './scheme/short-mocked-schema';

export function getPropertiesServiceMock() {
  // Create jasmine spy object
  let propertiesService = jasmine.createSpyObj(LdapPropertiesService, ['loadSchema']);
  propertiesService.loadSchema.and.returnValue(ShortMockedSchema);
  return propertiesService;
}
