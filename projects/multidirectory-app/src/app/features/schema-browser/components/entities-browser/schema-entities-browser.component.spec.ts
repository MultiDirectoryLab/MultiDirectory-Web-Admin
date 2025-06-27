import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaEntitiesBrowserComponent } from './schema-entities-browser.component';

describe('EntitiesBrowserComponent', () => {
  let component: SchemaEntitiesBrowserComponent;
  let fixture: ComponentFixture<SchemaEntitiesBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaEntitiesBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaEntitiesBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
