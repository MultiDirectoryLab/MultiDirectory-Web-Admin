import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdPortalComponent } from './portal.component';
import { MdPortalDirective } from './portal.directive';

describe('Portal test suite', () => {
  let fixture: ComponentFixture<MdPortalComponent>;
  let component: MdPortalComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MdPortalComponent, MdPortalDirective],
      imports: [],
      teardown: {
        destroyAfterEach: true,
      },
    })
      .compileComponents()
      .then((_) => {
        fixture = TestBed.createComponent(MdPortalComponent);
        component = fixture.componentInstance;
      });
  });

  it('Should create component', () => {});
});
