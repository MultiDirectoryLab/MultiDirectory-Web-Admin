import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaEntityDetailObjectClassesComponent } from './schema-entity-detail-object-classes.component';

describe('EntityDetailObjectClassesComponent', () => {
  let component: SchemaEntityDetailObjectClassesComponent;
  let fixture: ComponentFixture<SchemaEntityDetailObjectClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaEntityDetailObjectClassesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaEntityDetailObjectClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
