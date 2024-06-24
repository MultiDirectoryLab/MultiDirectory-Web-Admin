import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MdPortalComponent } from './portal.component';
import { MdPortalDirective } from './portal.directive';
import { MdPortalService } from './portal.service';

describe('Portal Directive Test Suite', () => {
  let fixture: ComponentFixture<MdPortalComponent>;
  let component: MdPortalComponent;
  let service: MdPortalService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MdPortalComponent, MdPortalDirective],
      providers: [MdPortalService],
      teardown: {
        destroyAfterEach: true,
      },
    })
      .overrideComponent(MdPortalComponent, {
        set: {
          template: '<div [mdPortal]="\'test\'">TEST</div>',
        },
      })
      .compileComponents()
      .then((_) => {
        fixture = TestBed.createComponent(MdPortalComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(MdPortalService);
      });
  });

  it('Should create component and provide a portal', fakeAsync(async () => {
    fixture.changeDetectorRef.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
      const portal = service.get('test');
      expect(portal).toBeTruthy();
    });
  }));
});
