import { Component, Input, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { BaseComponent } from "../base-component/base.component";

@Component({
    selector: 'md-radiogroup',
    templateUrl: './radio-group.component.html',
    styleUrls: ['./radio-group.component.scss'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => RadioGroupComponent),  // replace name as appropriate
          multi: true
        }
    ]
})
export class RadioGroupComponent extends BaseComponent {
    @Input() drawBorder = false;
    @Input() title = '';
}