import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { RadioGroupComponent } from "../radiobutton-group/radio-group.component";

@Component({
    selector: 'md-radiobutton',
    templateUrl: 'radiobutton.component.html',
    styleUrls: ['radiobutton.component.scss']
})
export class RadiobuttonComponent implements OnInit {
    @Input() name!: string;
    @Input() value: any;
    @Input() group!: RadioGroupComponent;
    @ViewChild('radio') input!: ElementRef<HTMLInputElement>;

    ngOnInit(): void {
        this.group?.valueChanges?.subscribe(x => {
            this.input.nativeElement.checked = !!x;
        })
    }
    onClick(event: Event) {
        this.input.nativeElement.click();
        this.group.value = this.value;
    }
}

export { RadioGroupComponent };
