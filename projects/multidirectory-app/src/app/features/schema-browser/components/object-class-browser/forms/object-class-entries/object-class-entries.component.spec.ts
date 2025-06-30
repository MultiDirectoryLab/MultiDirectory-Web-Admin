import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassEntriesComponent } from './object-class-entries.component';

describe('ObjectClassEntriesComponent', () => {
  let component: ObjectClassEntriesComponent;
  let fixture: ComponentFixture<ObjectClassEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectClassEntriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectClassEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
