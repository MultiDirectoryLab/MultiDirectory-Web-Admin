import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'md-plane-button',
    templateUrl: './plane-button.component.html',
    styleUrls: ['./plane-button.component.scss']
})
export class PlaneButtonComponent {
    @Input() disabled = false;
    @Input() primary = false;
    @Output() click = new EventEmitter();

    public emitClick(event: Event) {
        event.stopPropagation();
        if(this.disabled) {
            return;
        }
        this.click.emit(event);
    }
}