import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Component({
    selector: 'md-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() disabled = false;
    @Output() checkedChange = new EventEmitter<boolean>();
    
    innerValue = false;

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