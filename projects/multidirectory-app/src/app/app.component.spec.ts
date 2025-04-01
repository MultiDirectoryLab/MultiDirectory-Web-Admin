import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { getTranslocoModule } from '@testing/transloco-testing';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, getTranslocoModule(), AppComponent],
      providers: [{ provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() }],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
