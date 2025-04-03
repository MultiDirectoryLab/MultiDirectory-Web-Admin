import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PlaneButtonComponent } from './plane-button.component';

describe('PlaneButtonComp', () => {
  let fixture: ComponentFixture<PlaneButtonComponent>;
  let component: PlaneButtonComponent;
  let button: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaneButtonComponent],
      providers: [],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaneButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.debugElement.nativeElement.querySelector('button');
  });

  it('#clicked() should emit', fakeAsync(async () => {
    spyOn(component.click, 'emit');
    button.click();
    tick();
    expect(component.click.emit).toHaveBeenCalled();
  }));
});
