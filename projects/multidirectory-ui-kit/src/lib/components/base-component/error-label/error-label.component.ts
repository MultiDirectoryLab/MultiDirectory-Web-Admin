import { AfterViewInit, Component, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Component({
    selector: 'md-error-label',
    templateUrl: './error-label.component.html',
    styleUrls: ['./error-label.component.scss']
})
export class ErrorLabelComponent implements AfterViewInit {
    @Input() ngControl!: NgControl;

    constructor() {
    }
    ngAfterViewInit(): void {
    }
}