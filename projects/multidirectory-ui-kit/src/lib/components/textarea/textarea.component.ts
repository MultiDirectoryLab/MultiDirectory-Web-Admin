import { Component, Input, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseComponent } from "../base-component/base.component";

@Component({
    selector: 'md-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextareaComponent),
        multi: true
    }]
})
export class TextareaComponent  extends BaseComponent {
    @Input() label: string | null = null;
    @Input() expandWidth = false;
    @Input() expandHeight = false;
}