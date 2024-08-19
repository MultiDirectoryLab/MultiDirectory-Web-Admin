import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComp', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;
  let button: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ButtonComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
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
