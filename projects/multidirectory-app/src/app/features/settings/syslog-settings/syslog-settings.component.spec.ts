import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogSettingsComponent } from './syslog-settings.component';

describe('SyslogSettingsComponent', () => {
  let component: SyslogSettingsComponent;
  let fixture: ComponentFixture<SyslogSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyslogSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyslogSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
