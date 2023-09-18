import { AfterViewInit, Component, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Component({
    selector: 'md-error-label',
    templateUrl: './error-label.component.html',
    styleUrls: ['./error-label.component.scss']
})
export class ErrorLabelComponent {
    @Input() ngControl!: NgControl;
    constructor() {
    }
    
    getFirstError(): string | undefined{
         if(!!this.ngControl?.errors?.['required']) {
            return 'required';
         }
         if(!!this.ngControl?.errors?.['pattern']) {
            return 'pattern';
         }
         if(!!this.ngControl?.errors?.['PasswordsDoNotMatch']) {
            return 'PasswordsDoNotMatch';
         }
         if(!!this.ngControl?.errors?.['DomainFormat']) {
            return 'DomainFormat';
         }
         if(!!this.ngControl?.errors?.['IpAddress']) {
            return 'IpAddress';
         }
         return undefined;
    }
}