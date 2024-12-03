import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { EntityAttributesComponent } from './entity-attributes.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { getToastrMock } from '@testing/toastr-stub-mock';
import { getTranslocoModule } from '@testing/transloco-testing';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { AttributeService } from '@services/attributes.service';
import { getActivatedRouteMock } from '@testing/activated-route-mock';
import { ActivatedRoute } from '@angular/router';
import { LdapNodeMock } from '@testing/ldap-entry-node-mock';
import { LdapPropertiesService } from '@services/ldap-properties.service';
import { getPropertiesServiceMock } from '@testing/properties-service-mock';

describe('EntityAttributesComponent', () => {
  let attributeService: AttributeService;
  let propertiesService: LdapPropertiesService;

  let componentFixture: ComponentFixture<EntityAttributesComponent>;
  let component: EntityAttributesComponent;
  beforeEach(async () => {
    attributeService = new AttributeService();

    TestBed.configureTestingModule({
      imports: [MultidirectoryUiKitModule, getTranslocoModule()],
      declarations: [EntityAttributesComponent],
      providers: [
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
        { provide: ToastrService, useValue: getToastrMock() },
        { provide: ActivatedRoute, useValue: getActivatedRouteMock() },
        { provide: LdapPropertiesService, useValue: getPropertiesServiceMock() },
      ],
    });
  });

  beforeEach(() => {
    componentFixture = TestBed.createComponent(EntityAttributesComponent);
    component = componentFixture.componentInstance;
    propertiesService = TestBed.inject(LdapPropertiesService);
  });

  const partialAttributes = [
    { type: 'distingushedName', vals: ['firstValue', 'secondValue'] },
    { type: 'cn', vals: ['test'] },
    { type: 'fullname', vals: [] },
  ];

  function getAccessor(): LdapAttributes {
    const attributes = new LdapAttributes(partialAttributes);
    const node = LdapNodeMock;
    let accessor = attributeService.getTrackableAttributes(node, attributes);
    return accessor;
  }

  describe('Should initialize component', () => {
    it('Should subscribe to accessorRx and load schema', async () => {
      const accessor = getAccessor();
      component.accessor = accessor;
      componentFixture.detectChanges();
      expect(propertiesService.loadSchema).toHaveBeenCalled();
    });
  });
});
