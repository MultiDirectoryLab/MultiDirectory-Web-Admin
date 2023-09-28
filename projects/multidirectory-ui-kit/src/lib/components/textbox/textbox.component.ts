import { ChangeDetectorRef, Component, Input, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseComponent } from "../base-component/base.component";

@Component({
    selector: 'md-textbox',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextboxComponent),
        multi: true
    }]
})
export class TextboxComponent extends BaseComponent  {
    @Input() label: string = '';
    @Input() password: boolean = false;
    @Input() autocomplete: boolean = false;
    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}