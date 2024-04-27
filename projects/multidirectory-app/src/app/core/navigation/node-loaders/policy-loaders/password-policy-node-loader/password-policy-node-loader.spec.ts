import { take } from 'rxjs';
import { PasswordPolicyNodeLoader } from './password-policy-node-loader';
import { TestBed } from '@angular/core/testing';
import { getPasswordPolicyLoaderMock } from '@testing/password-policy-node-loader-mock';

describe('PasswordPolicyNodeLoader Test Suit', () => {
  let passwordPolicyLoader: PasswordPolicyNodeLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [{ provide: PasswordPolicyNodeLoader, useValue: getPasswordPolicyLoaderMock() }],
    }).compileComponents();
  });

  beforeEach(async () => {
    passwordPolicyLoader = TestBed.inject(PasswordPolicyNodeLoader);
  });

  it('Should return some nodes', () => {
    passwordPolicyLoader
      .get()
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
      });
  });
});
