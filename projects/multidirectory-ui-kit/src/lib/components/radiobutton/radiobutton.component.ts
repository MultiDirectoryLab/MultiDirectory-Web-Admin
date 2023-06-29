import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { RadioGroupComponent } from "../radiobutton-group/radio-group.component";

@Component({
    selector: 'md-radiobutton',
    templateUrl: 'radiobutton.component.html',
    styleUrls: ['radiobutton.component.scss']
})
export class RadiobuttonComponent {
    @Input() name!: string;
    @Input() value: any;
    @Input() group!: RadioGroupComponent;
    @ViewChild('radio') input!: ElementRef<HTMLInputElement>;
    onClick(event: Event) {
        this.input.nativeElement.click();
        this.group.value = this.value;
    }
}

export { RadioGroupComponent };
