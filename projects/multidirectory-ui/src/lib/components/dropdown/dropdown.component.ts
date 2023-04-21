import { Component, Input, Output } from "@angular/core";

@Component({
    selector: 'mf-dropdown',
    styleUrls: ['./dropdown.component.scss'],
    templateUrl: 'dropdown.component.html'
})
export class DropdownComponent {
    @Input() options: string[] = [];
    @Input() label: string = '';
    @Input() id: string = '';
    @Input() @Output() model: string = ''
}