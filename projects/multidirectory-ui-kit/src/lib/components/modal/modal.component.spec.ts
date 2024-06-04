import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { MdModalComponent } from './modal.component';
import { ModalTestComponent } from './modaltest.component';
import { ModalInjectDirective } from './modal-inject.directive';
import { ModalModule } from './ng-modal-lib/public-api';

describe('MdModalComponent', () => {
  let fixture: ComponentFixture<ModalTestComponent>;
  let component: ModalTestComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ModalModule],
      declarations: [ModalTestComponent, MdModalComponent, ModalInjectDirective],
      teardown: { destroyAfterEach: false },
    })
      .compileComponents()
      .then((_) => {
        fixture = TestBed.createComponent(ModalTestComponent);
        component = fixture.componentInstance;
      });
  });

  it('should open and close md modal', () => {
    fixture.detectChanges();
    component.open();
    fixture.detectChanges();
    expect(component.modal!.modal!.modalRoot!.visible).toBeTrue();
    component.modal?.close();
    fixture.detectChanges();
    expect(component.modal!.modal?.modalRoot?.visible).toBeFalse();
  });

  it('should render body', () => {
    fixture.detectChanges();
    component.open();
    fixture.detectChanges();
    const bannerElement: HTMLElement = fixture.nativeElement.querySelector('.ui-modal-body');
    expect(bannerElement.innerText).toContain('rem Ipsum is sim');
  });
});
