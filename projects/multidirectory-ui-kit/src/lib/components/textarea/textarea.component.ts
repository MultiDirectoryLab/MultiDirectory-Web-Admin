import { Component, Input } from "@angular/core";
import { BaseComponent } from "../base-component/base.component";

@Component({
    selector: 'md-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent  extends BaseComponent {
    @Input() label: string | null = null;
}