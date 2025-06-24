import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassBrowserComponent } from './object-class-browser.component';

describe('ObjectClassBrowserComponent', () => {
  let component: ObjectClassBrowserComponent;
  let fixture: ComponentFixture<ObjectClassBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectClassBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectClassBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
