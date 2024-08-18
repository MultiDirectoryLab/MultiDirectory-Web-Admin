import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { EntitySelectorComponent } from './entity-selector.component';
import { getMockModalInjectDirective } from '@testing/modal-inject-testing';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { EntitySelectorSettings } from './entity-selector-settings.component';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { getTranslocoModule } from '@testing/transloco-testing';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { AccessPolicyNodeLoader } from '@core/navigation/node-loaders/policy-loaders/access-policy-node-loader/access-policy-node-loader';
import { SavedQueriesNodeLoader } from '@core/navigation/node-loaders/saved-query-node-loader/saved-query-node-loader';
import { getAccessPolicyNodeLoaderMock } from '@testing/access-policy-node-loader-mock';
import { getLdapTreeLoaderMock } from '@testing/ldap-tree-loader-mock';
import { getSavedQueriesLoaderMock } from '@testing/saved-queries-node-loader-mock';

describe('Entity Selector Test Suite', () => {
  let component: EntitySelectorComponent;
  let fixture: ComponentFixture<EntitySelectorComponent>;
  let modalControl = getMockModalInjectDirective({
    settings: new EntitySelectorSettings({
      selectedPlaceDn: 'dc=localhost,dc=test',
      selectedEntityTypes: ENTITY_TYPES.splice(0, 2),
      allowSelectEntityTypes: false,
    }),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntitySelectorComponent],
      imports: [getTranslocoModule()],
      providers: [
        EntitySelectorComponent,
        {
          provide: ModalInjectDirective,
          useValue: modalControl,
        },
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: LdapEntryLoader, useValue: getLdapTreeLoaderMock() },
        { provide: SavedQueriesNodeLoader, useValue: getSavedQueriesLoaderMock() },
        { provide: AccessPolicyNodeLoader, useValue: getAccessPolicyNodeLoaderMock() },
      ],
    });
  });

  it('Entity Type Selector Should Be Disallowed to edit', fakeAsync(async () => {
    modalControl.contentOptions.settings.allowSelectEntityTypes = false;

    fixture = TestBed.createComponent(EntitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      expect(component.allowSelectEntityTypes).toBeFalse();
    });
  }));

  it('Entity Type Selector Should Be Allowed to edit', fakeAsync(() => {
    modalControl.contentOptions.settings.allowSelectEntityTypes = true;

    fixture = TestBed.createComponent(EntitySelectorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      expect(component.allowSelectEntityTypes).toBeTrue();
    });
  }));
});
