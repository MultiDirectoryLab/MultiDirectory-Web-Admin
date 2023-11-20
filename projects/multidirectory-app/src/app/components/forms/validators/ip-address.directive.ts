import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
@Directive({
    selector: '[validIpAddress]',
    providers: [{
      provide: NG_VALIDATORS, 
      useExisting: IpAddressValidatorDirective, 
      multi: true
    }]
  })
  export class IpAddressValidatorDirective implements Validator {
    @Input('IpAddressValidatorDerictive') errorLabel = 'Enter a valid IP Address';
    ipPattern = new RegExp(`^((\d{1, 3})\.?){4}(?:\/[0-9]{1,3}){0,1}?$`);
    subnetPattern = new RegExp(`^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$`);
    widePattern = new RegExp(`^(((255\.){3})|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$`);

    validate(control: AbstractControl): ValidationErrors | null {
        return null;
        let result = this.ipPattern.test(control.value);
        if(result) {
            return null;
        }
        result = this.subnetPattern.test(control.value);
        if(result) {
            return null;
        }
        return result? null : { 'IpAddress' : true };
    }
  }