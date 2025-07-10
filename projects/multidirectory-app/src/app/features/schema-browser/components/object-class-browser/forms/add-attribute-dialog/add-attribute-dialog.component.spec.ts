import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAttributeDialogComponent } from './add-attribute-dialog.component';

describe('AddAttributeDialog', () => {
  let component: AddAttributeDialogComponent;
  let fixture: ComponentFixture<AddAttributeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttributeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAttributeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
