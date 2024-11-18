import { TestBed } from '@angular/core/testing';
import { EntityTypeSelectorComponent } from './entity-type-selector.component';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import {
  MockModalInjectDirective,
  getMockModalInjectDirective,
} from '@testing/modal-inject-testing';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';

describe('Entity Type Selector Test Suite', () => {
  let component: EntityTypeSelectorComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityTypeSelectorComponent],
      providers: [
        EntityTypeSelectorComponent,
        {
          provide: ModalInjectDirective,
          useFactory: () =>
            getMockModalInjectDirective({
              selectedEntityTypes: [ENTITY_TYPES[1]],
            }),
        },
      ],
      teardown: { destroyAfterEach: true },
    });
    component = TestBed.inject(EntityTypeSelectorComponent) as EntityTypeSelectorComponent;
  });

  it('Entity Type Selector Should Be', () => {
    const selected = component.tree.find((x) => x.id == ENTITY_TYPES[1].id);
  });
});
