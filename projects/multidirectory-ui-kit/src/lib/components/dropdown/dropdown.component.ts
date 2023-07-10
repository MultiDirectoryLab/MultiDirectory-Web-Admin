import { Component, Input, Output, forwardRef } from "@angular/core";
import { BaseComponent } from "../base-component/base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";


export class DropdownOption {
    title: string = '';
    value: any;
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
    @Input() label: string = '';
    @Input() id: string = '';

    getTitle(value: DropdownOption | string) {
        return typeof value === "string" ? value : (<DropdownOption>value).title;
    }

    getValue(value: DropdownOption | string, index: number) {
        return typeof value === "string" ? value : (<DropdownOption>value).value;
    }
}