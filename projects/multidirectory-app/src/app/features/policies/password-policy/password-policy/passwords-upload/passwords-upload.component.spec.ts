import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsUploadComponent } from './passwords-upload.component';

describe('PasswordsUploadComponent', () => {
  let component: PasswordsUploadComponent;
  let fixture: ComponentFixture<PasswordsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordsUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
