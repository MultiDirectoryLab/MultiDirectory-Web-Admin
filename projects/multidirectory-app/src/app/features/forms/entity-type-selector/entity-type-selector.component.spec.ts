import { TestBed } from '@angular/core/testing';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { getMockModalInjectDirective } from '@testing/modal-inject-testing';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { EntityTypeSelectorComponent } from './entity-type-selector.component';

describe('Entity Type Selector Test Suite', () => {
  let component: EntityTypeSelectorComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityTypeSelectorComponent],
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
