import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EnsureBearerInterceptor } from './ensure-bearer-interceptor';
import { RefreshTokenInterceptor } from './refresh-token-interceptor';
import { StaleTokenInterceptor } from './stale-token-interceptor';
import { ResultCodeInterceptor } from '@core/api/error-handling/result-code-interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EnsureBearerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StaleTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResultCodeInterceptor,
      multi: true,
    },
  ],
})
export class AuthorizationModule {}
