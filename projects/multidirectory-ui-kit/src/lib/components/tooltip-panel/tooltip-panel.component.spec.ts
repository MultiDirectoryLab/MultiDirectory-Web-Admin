import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipPanelComponent } from './tooltip-panel.component';

describe('TooltipPanelComponent', () => {
  let component: TooltipPanelComponent;
  let fixture: ComponentFixture<TooltipPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
