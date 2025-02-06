import { NgModule } from '@angular/core';
import { DomainFormatValidatorDirective } from './domainformat.directive';
import { PasswordMatchValidatorDirective } from './passwordmatch.directive';
import { IpAddressValidatorDirective } from './ip-address.directive';
import { MfKeyValidatorDirective } from './mf-keys-validator.directive';
import { RequiredWithMessageDirective } from './required-with-message.directive';
import { PatternWithMessageDirective } from './pattern-with-message.directive';
import { PasswordShouldNotMatchValidatorDirective } from './passwordnotmatch.directive';
import { Ip6AddressValidatorDirective } from './ip6-address.directive';
import { DnsSrvValidatorDirective } from './dns-srv-format.directive';
import { PasswordValidatorDirective } from './password-validator.directive';

@NgModule({
  declarations: [
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
