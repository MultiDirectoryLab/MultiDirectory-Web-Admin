import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogEventSettingsComponent } from './syslog-event-settings.component';

describe('SyslogEventSettingsComponent', () => {
  let component: SyslogEventSettingsComponent;
  let fixture: ComponentFixture<SyslogEventSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyslogEventSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyslogEventSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
