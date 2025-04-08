import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ResultCodeInterceptor } from '@core/api/error-handling/result-code-interceptor';
import { PasswordPolicyViolationInterceptor } from '@core/api/error-handling/password-policy-violation-interceptor';

@NgModule({
  providers: [],
})
export class AuthorizationModule {}
