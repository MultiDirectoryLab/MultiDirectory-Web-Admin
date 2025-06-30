import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesDetailsDialogComponent } from './schema-entities-details-dialog.component';

describe('EntitiesDetailsDialogComponent', () => {
  let component: EntitiesDetailsDialogComponent;
  let fixture: ComponentFixture<EntitiesDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntitiesDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
