import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'md-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    @Input() label = '';
    @Input() disabled = false;
    @Input() primary = false;
    @Output() click = new EventEmitter();

    public emitClick(event: Event) {
        event.stopPropagation();
        this.click.emit(event);
    }
}