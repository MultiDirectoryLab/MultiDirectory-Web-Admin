import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassPropertiesComponent } from './object-class-properties.component';

describe('ObjectClassPropertiesComponent', () => {
  let component: ObjectClassPropertiesComponent;
  let fixture: ComponentFixture<ObjectClassPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectClassPropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectClassPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
