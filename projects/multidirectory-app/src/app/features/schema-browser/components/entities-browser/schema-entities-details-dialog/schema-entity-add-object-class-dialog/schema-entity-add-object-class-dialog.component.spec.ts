import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaEntityAddObjectClassDialogComponent } from './schema-entity-add-object-class-dialog.component';

describe('SchemaEntityAddObjectClassDialogComponent', () => {
  let component: SchemaEntityAddObjectClassDialogComponent;
  let fixture: ComponentFixture<SchemaEntityAddObjectClassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaEntityAddObjectClassDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaEntityAddObjectClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
