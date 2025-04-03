import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdPortalComponent } from './portal.component';
import { MdPortalDirective } from './portal.directive';

describe('Portal test suite', () => {
  let fixture: ComponentFixture<MdPortalComponent>;
  let component: MdPortalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdPortalComponent, MdPortalDirective],
      teardown: {
        destroyAfterEach: true,
      },
    }).compileComponents();
    fixture = TestBed.createComponent(MdPortalComponent);
    component = fixture.componentInstance;
  });

  it('Should create component', () => {});
});
