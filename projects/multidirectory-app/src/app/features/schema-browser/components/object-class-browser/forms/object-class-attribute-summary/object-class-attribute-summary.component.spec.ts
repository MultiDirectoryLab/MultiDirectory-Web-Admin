import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassAttributeSummaryComponent } from './object-class-attribute-summary.component';

describe('ObjectClassAttributeSummaryComponent', () => {
  let component: ObjectClassAttributeSummaryComponent;
  let fixture: ComponentFixture<ObjectClassAttributeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectClassAttributeSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectClassAttributeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
