import { TestBed } from '@angular/core/testing';
import { EntityTypeSelectorComponent } from './entity-type-selector.component';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import {
  MockModalInjectDirective,
  getMockModalInjectDirective,
} from '@testing/modal-inject-testing';

describe('Entity Type Selector Test Suite', () => {
  let component: EntityTypeSelectorComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityTypeSelectorComponent],
      providers: [
        EntityTypeSelectorComponent,
        {
          provide: ModalInjectDirective,
          useFactory: getMockModalInjectDirective({
            selected,
          }),
        },
      ],
    });
    component = TestBed.inject(EntityTypeSelectorComponent);
  });

  it('Entity Type Selector Should Be', () => {});
});
