import { NgModule } from '@angular/core';
import { DomainFormatValidatorDirective } from './domainformat.directive';
import { PasswordMatchValidatorDirective } from './passwordmatch.directive';
import { IpAddressValidatorDirective } from './ip-address.directive';
import { MfKeyValidatorDirective } from './mf-keys-validator.directive';
import { RequiredWithMessageDirective } from './required-with-message.directive';
import { PatternWithMessageDirective } from './pattern-with-message.directive';
import { PasswordNotMatchValidatorDirective } from './passwordnotmatch.directive';
import { Ip6AddressValidatorDirective } from './ip6-address.directive';

@NgModule({
  declarations: [
    DomainFormatValidatorDirective,
    PasswordMatchValidatorDirective,
    PasswordNotMatchValidatorDirective,
    IpAddressValidatorDirective,
    Ip6AddressValidatorDirective,
    MfKeyValidatorDirective,
    RequiredWithMessageDirective,
    PatternWithMessageDirective,
  ],
  exports: [
    DomainFormatValidatorDirective,
    PasswordMatchValidatorDirective,
    PasswordNotMatchValidatorDirective,
    IpAddressValidatorDirective,
    Ip6AddressValidatorDirective,
    MfKeyValidatorDirective,
    RequiredWithMessageDirective,
    PatternWithMessageDirective,
  ],
})
export class ValidatorsModule {}
