import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDetailObjectClassesComponent } from './entity-detail-object-classes.component';

describe('EntityDetailObjectClassesComponent', () => {
  let component: EntityDetailObjectClassesComponent;
  let fixture: ComponentFixture<EntityDetailObjectClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityDetailObjectClassesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityDetailObjectClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
