import { Component, ElementRef, Input, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'md-radiogroup',
    template: '',
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => RadiogroupComponent),  // replace name as appropriate
          multi: true
        }
    ]
})
export class RadiogroupComponent implements ControlValueAccessor {
    @Input() disabled = false;

    innerValue: any;

    get value(): any {
        return this.innerValue;
    };

    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this._onChange(v);
        }
    }

    private _onChange = (value: any) => {};
    private _onTouched = () => {};

    writeValue(value: any): void {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onBlur() {
        this._onTouched();
    }
}

@Component({
    selector: 'md-radiobutton',
    templateUrl: 'radiobutton.component.html',
    styleUrls: ['radiobutton.component.scss']
})
export class RadiobuttonComponent {
    @Input() name!: string;
    @Input() value: any;
    @Input() group!: RadiogroupComponent;
    @ViewChild('radio') input!: ElementRef<HTMLInputElement>;
    onClick(event: Event) {
        this.input.nativeElement.click();
        this.group.value = this.value;
    }
}