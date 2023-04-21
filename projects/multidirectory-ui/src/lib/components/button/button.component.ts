import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'mf-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    @Input() label = '';
    @Input() disabled = false;
    @Output() click = new EventEmitter();

    public emitClick(event: Event) {
        event.stopPropagation();
        this.click.emit(event);
    }
}