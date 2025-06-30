import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaEntityDetailEntriesComponent } from './schema-entity-detail-entries.component';

describe('EntityDetailEntriesComponent', () => {
  let component: SchemaEntityDetailEntriesComponent;
  let fixture: ComponentFixture<SchemaEntityDetailEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaEntityDetailEntriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaEntityDetailEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
