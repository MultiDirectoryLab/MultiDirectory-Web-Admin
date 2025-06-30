import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaBrowserHeaderComponent } from './schema-browser-header.component';

describe('SchemaBrowserHeaderComponent', () => {
  let component: SchemaBrowserHeaderComponent;
  let fixture: ComponentFixture<SchemaBrowserHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaBrowserHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemaBrowserHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
