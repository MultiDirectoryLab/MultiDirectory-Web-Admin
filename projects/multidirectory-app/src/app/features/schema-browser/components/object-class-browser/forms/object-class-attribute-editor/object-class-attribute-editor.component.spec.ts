import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassAttributeEditorComponent } from './object-class-attribute-editor.component';

describe('ObjectClassAttributeEditorComponent', () => {
  let component: ObjectClassAttributeEditorComponent;
  let fixture: ComponentFixture<ObjectClassAttributeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectClassAttributeEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectClassAttributeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
