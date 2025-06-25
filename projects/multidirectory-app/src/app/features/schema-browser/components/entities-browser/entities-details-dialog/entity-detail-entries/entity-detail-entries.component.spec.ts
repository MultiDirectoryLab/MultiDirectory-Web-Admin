import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDetailEntriesComponent } from './entity-detail-entries.component';

describe('EntityDetailEntriesComponent', () => {
  let component: EntityDetailEntriesComponent;
  let fixture: ComponentFixture<EntityDetailEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityDetailEntriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDetailEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
