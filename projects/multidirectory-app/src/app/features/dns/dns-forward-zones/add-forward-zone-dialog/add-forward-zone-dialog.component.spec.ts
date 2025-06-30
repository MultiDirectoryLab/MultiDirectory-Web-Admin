import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddForwardZoneDialogComponent } from './add-forward-zone-dialog.component';

describe('AddForwardZoneDialogComponent', () => {
  let component: AddForwardZoneDialogComponent;
  let fixture: ComponentFixture<AddForwardZoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddForwardZoneDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddForwardZoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
