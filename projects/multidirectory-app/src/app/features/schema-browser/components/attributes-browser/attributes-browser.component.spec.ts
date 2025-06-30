import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesBrowserComponent } from './attributes-browser.component';

describe('AttributesBrowserComponent', () => {
  let component: AttributesBrowserComponent;
  let fixture: ComponentFixture<AttributesBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributesBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
