import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { AttributeService } from '@services/attributes.service';
import { LdapPropertiesService } from '@services/ldap-properties.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { getActivatedRouteMock } from '@testing/activated-route-mock';
import { LdapNodeMock } from '@testing/ldap-entry-node-mock';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { getPropertiesServiceMock } from '@testing/properties-service-mock';
import { getToastrMock } from '@testing/toastr-stub-mock';
import { getTranslocoModule } from '@testing/transloco-testing';
import { ToastrService } from 'ngx-toastr';
import { EntityAttributesComponent } from './entity-attributes.component';

describe('EntityAttributesComponent', () => {
  let attributeService: AttributeService;
  let propertiesService: LdapPropertiesService;

  let componentFixture: ComponentFixture<EntityAttributesComponent>;
  let component: EntityAttributesComponent;
  beforeEach(async () => {
    attributeService = new AttributeService();

    TestBed.configureTestingModule({
      imports: [getTranslocoModule(), EntityAttributesComponent],
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

  const LdapAttributes = [
    { type: 'distingushedName', vals: ['firstValue', 'secondValue'] },
    { type: 'cn', vals: ['test'] },
    { type: 'fullname', vals: [] },
  ];

  function getAccessor(): LdapAttributes {
    const attributes = new LdapAttributes(LdapAttributes);
    const node = LdapNodeMock;
    const accessor = attributeService.getTrackableAttributes(node, attributes);
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
