import { NgModule } from "@angular/core";
import { DomainFormatValidatorDirective } from "./domainformat.directive";
import { PasswordMatchValidatorDirective } from "./passwordmatch.directive";
import { IpAddressValidatorDirective } from "./ip-address.directive";

@NgModule({
    declarations: [
        DomainFormatValidatorDirective,
        PasswordMatchValidatorDirective,
        IpAddressValidatorDirective
    ],
    exports: [
        DomainFormatValidatorDirective,
        PasswordMatchValidatorDirective,
        IpAddressValidatorDirective
    ]
})
export class ValidatorsModule {
}