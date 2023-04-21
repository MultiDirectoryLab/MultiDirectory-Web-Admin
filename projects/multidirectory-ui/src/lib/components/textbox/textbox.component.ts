import { Component, Input } from "@angular/core";

@Component({
    selector: 'mf-textbox',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent {
    @Input() label: string = '';
}