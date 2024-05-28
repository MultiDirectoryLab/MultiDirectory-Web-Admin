import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { getTranslocoModule } from './testing/transloco-testing';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, getTranslocoModule()],
      declarations: [AppComponent],
      providers: [{ provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
