import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { MdModalComponent } from './modal.component';
import { ModalTestComponent } from './modal-test.component';
import { ModalInjectDirective } from './modal-inject/modal-inject.directive';
import { MdModalModule } from './modal.module';

describe('MdModalComponent', () => {
  let fixture: ComponentFixture<ModalTestComponent>;
  let component: ModalTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MdModalModule],
      declarations: [ModalTestComponent, MdModalComponent, ModalInjectDirective],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach((_) => {
    fixture = TestBed.createComponent(ModalTestComponent);
    component = fixture.componentInstance;
  });

  xit('should open and close md modal', () => {
    fixture.detectChanges();
    component.open();
    fixture.detectChanges();
    tick();
    expect(component.modal!.modal!.visible).toBeTrue();
    component.modal?.close();
    fixture.detectChanges();
    expect(component.modal!.modal?.visible).toBeFalse();
  });

  xit('should render body', () => {
    fixture.detectChanges();
    component.open();
    fixture.detectChanges();
    tick();
    const bannerElement: HTMLElement = fixture.nativeElement.querySelector('.ui-modal-body');
    expect(bannerElement.innerText).toContain('rem Ipsum is sim');
  });
});
