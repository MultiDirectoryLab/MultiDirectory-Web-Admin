import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassCreateDialogComponent } from './object-class-create-dialog.component';

describe('ObjectClassCreateDialogComponent', () => {
  let component: ObjectClassCreateDialogComponent;
  let fixture: ComponentFixture<ObjectClassCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectClassCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectClassCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
