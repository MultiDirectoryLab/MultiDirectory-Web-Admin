import { NgModule } from '@angular/core';
import { DnsSrvValidatorDirective } from './dns-srv-format.directive';
import { DomainFormatValidatorDirective } from './domainformat.directive';
import { IpAddressValidatorDirective } from './ip-address.directive';
import { Ip6AddressValidatorDirective } from './ip6-address.directive';
import { MfKeyValidatorDirective } from './mf-keys-validator.directive';
import { PasswordValidatorDirective } from './password-validator.directive';
import { PasswordMatchValidatorDirective } from './passwordmatch.directive';
import { PasswordShouldNotMatchValidatorDirective } from './passwordnotmatch.directive';
import { PatternWithMessageDirective } from './pattern-with-message.directive';
import { RequiredWithMessageDirective } from './required-with-message.directive';

@NgModule({
  imports: [
    DomainFormatValidatorDirective,
    PasswordMatchValidatorDirective,
    PasswordShouldNotMatchValidatorDirective,
    IpAddressValidatorDirective,
    Ip6AddressValidatorDirective,
    MfKeyValidatorDirective,
    RequiredWithMessageDirective,
    PatternWithMessageDirective,
    DnsSrvValidatorDirective,
    PasswordValidatorDirective,
  ],
  exports: [
    DomainFormatValidatorDirective,
    PasswordMatchValidatorDirective,
    PasswordShouldNotMatchValidatorDirective,
    IpAddressValidatorDirective,
    Ip6AddressValidatorDirective,
    MfKeyValidatorDirective,
    RequiredWithMessageDirective,
    PatternWithMessageDirective,
    DnsSrvValidatorDirective,
    PasswordValidatorDirective,
  ],
})
export class ValidatorsModule {}
