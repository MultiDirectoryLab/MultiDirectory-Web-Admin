import { TestBed, fakeAsync } from '@angular/core/testing';
import { AccessPolicyNodeLoader } from './access-policy-node-loader';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { getTranslocoModule } from '@testing/transloco-testing';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { getAccessPolicyNodeLoaderMock } from '@testing/access-policy-node-loader-mock';

describe('AccessPolicyNodeLoaders', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AccessPolicyNodeLoader, useValue: getAccessPolicyNodeLoaderMock() },
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
      ],
      imports: [getTranslocoModule()],
    }).compileComponents();
  });

  it('node loader should return fake nodes', fakeAsync(async () => {
    const nodeLoader = new AccessPolicyNodeLoader(<MultidirectoryApiService>{});
    const root = nodeLoader.get();
    expect(root).toBeDefined();
  }));
});
