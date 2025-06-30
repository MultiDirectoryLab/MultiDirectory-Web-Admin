import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectClassCreateGeneralComponent } from './object-class-general.component';

describe('ObjectClassCreateGeneralComponent', () => {
  let component: ObjectClassCreateGeneralComponent;
  let fixture: ComponentFixture<ObjectClassCreateGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectClassCreateGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectClassCreateGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
