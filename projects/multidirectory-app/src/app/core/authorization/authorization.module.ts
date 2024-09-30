import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ResultCodeInterceptor } from '@core/api/error-handling/result-code-interceptor';
import { StaleTokenInterceptor } from './stale-token-interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StaleTokenInterceptor,
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
