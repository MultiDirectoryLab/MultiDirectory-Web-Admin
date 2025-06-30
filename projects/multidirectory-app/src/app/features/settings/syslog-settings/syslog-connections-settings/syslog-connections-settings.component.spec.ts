import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogConnectionsSettingsComponent } from './syslog-connections-settings.component';

describe('SyslogConnectionsSettingsComponent', () => {
  let component: SyslogConnectionsSettingsComponent;
  let fixture: ComponentFixture<SyslogConnectionsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyslogConnectionsSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyslogConnectionsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
