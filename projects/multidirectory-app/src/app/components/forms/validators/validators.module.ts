import { NgModule } from "@angular/core";
import { DomainFormatValidatorDirective } from "./domainformat.directive";
import { PasswordMatchValidatorDirective } from "./passwordmatch.directive";

@NgModule({
    declarations: [
        DomainFormatValidatorDirective,
        PasswordMatchValidatorDirective
    ],
    exports: [
        DomainFormatValidatorDirective,
        PasswordMatchValidatorDirective
    ]
})
export class ValidatorsModule {
}