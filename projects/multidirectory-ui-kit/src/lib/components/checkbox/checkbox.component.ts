import { Component, forwardRef } from "@angular/core";
import { BaseComponent } from "../base-component/base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'md-checkbox',
    styleUrls: ['./checkbox.component.scss'],
    templateUrl: './checkbox.component.html',
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => CheckboxComponent),  
          multi: true
        }
    ]
})
export class CheckboxComponent extends BaseComponent {}