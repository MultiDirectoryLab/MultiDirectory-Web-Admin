import { Component, Input, forwardRef } from "@angular/core";
import { BaseComponent } from "../base-component/base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'md-number',
    templateUrl: './number.component.html',
    styleUrls: ['./number.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NumberComponent),
        multi: true
    }]
})
export class NumberComponent extends BaseComponent {
    @Input() label = '';
    @Input() step = 1;
}