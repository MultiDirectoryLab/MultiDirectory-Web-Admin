import { Component, Input, Output, forwardRef } from "@angular/core";
import { BaseComponent } from "../base-component/base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";


export class DropdownOption {
    title: string = '';
    value: any;

    constructor(obj: Partial<DropdownOption>) {
        Object.assign(this, obj);
    }
}
@Component({
    selector: 'md-dropdown',
    styleUrls: ['./dropdown.component.scss'],
    templateUrl: 'dropdown.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DropdownComponent),
        multi: true
    }]
})
export class DropdownComponent extends BaseComponent {
    @Input() options: (DropdownOption | string)[] = [];

    getTitle(value: DropdownOption | string) {
        return typeof value === "string" ? value : (<DropdownOption>value).title;
    }

    getValue(value: DropdownOption | string, index: number) {
        return typeof value === "string" ? value : (<DropdownOption>value).value;
    }

    override writeValue(value: any): void {
        if (value !== this.innerValue && this.options) {
            const index = this.options.findIndex(x => typeof x == 'string' ? x == value : x.value == value);
            const innerValue = this.options[index] ;
            this.innerValue = typeof innerValue == 'string'? innerValue : innerValue?.value;
            this.cdr.detectChanges();
        }
    }
 
}