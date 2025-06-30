import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDetailsDialogComponent } from './attribute-details-dialog.component';

describe('AttributeDetailsDialogComponent', () => {
  let component: AttributeDetailsDialogComponent;
  let fixture: ComponentFixture<AttributeDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
