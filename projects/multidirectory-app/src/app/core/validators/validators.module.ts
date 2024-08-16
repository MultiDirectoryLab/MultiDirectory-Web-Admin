import { NgModule } from '@angular/core';
import { DomainFormatValidatorDirective } from './domainformat.directive';
import { PasswordMatchValidatorDirective } from './passwordmatch.directive';
import { IpAddressValidatorDirective } from './ip-address.directive';
import { MfKeyValidatorDirective } from './mf-keys-validator.directive';
import { RequiredWithMessageDirective } from './required-with-message.directive';
import { PatternWithMessageDirective } from './pattern-with-message.directive';
import { PasswordNotMatchValidatorDirective } from './passwordnotmatch.directive';

@NgModule({
  declarations: [
    DomainFormatValidatorDirective,
    PasswordMatchValidatorDirective,
    PasswordNotMatchValidatorDirective,
    IpAddressValidatorDirective,
    MfKeyValidatorDirective,
    RequiredWithMessageDirective,
    PatternWithMessageDirective,
  ],
  exports: [
    DomainFormatValidatorDirective,
    PasswordMatchValidatorDirective,
    PasswordNotMatchValidatorDirective,
    IpAddressValidatorDirective,
    MfKeyValidatorDirective,
    RequiredWithMessageDirective,
    PatternWithMessageDirective,
  ],
})
export class ValidatorsModule {}
