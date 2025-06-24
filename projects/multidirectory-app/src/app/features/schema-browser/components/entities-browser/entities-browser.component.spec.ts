import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesBrowserComponent } from './entities-browser.component';

describe('EntitiesBrowserComponent', () => {
  let component: EntitiesBrowserComponent;
  let fixture: ComponentFixture<EntitiesBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntitiesBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
