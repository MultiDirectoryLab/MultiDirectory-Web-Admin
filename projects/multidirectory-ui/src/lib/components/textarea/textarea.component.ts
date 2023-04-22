import { Component, Input } from "@angular/core";

@Component({
    selector: 'md-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent {
    @Input() label: string = '';
}