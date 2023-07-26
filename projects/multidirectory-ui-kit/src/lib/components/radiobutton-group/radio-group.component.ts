import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, QueryList, ViewChildren, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { BaseComponent } from "../base-component/base.component";
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";

@Component({
    selector: 'md-radiogroup',
    templateUrl: './radio-group.component.html',
    styleUrls: ['./radio-group.component.scss'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => RadioGroupComponent),  // replace name as appropriate
          multi: true
        }
    ]
})
export class RadioGroupComponent extends BaseComponent implements AfterViewInit {
    @Input() drawBorder = false;
    @Input() title = '';
    @Output() valueChanges = new EventEmitter<any>();
    @ViewChildren('input') buttons!: QueryList<HTMLInputElement>;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

    ngAfterViewInit(): void {
        this.buttons.changes.subscribe(x => {
            console.log(x);
        });
    }

    override writeValue(value: any): void {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.cdr.detectChanges();
        }
        this.valueChanges.emit(value);
    }
}