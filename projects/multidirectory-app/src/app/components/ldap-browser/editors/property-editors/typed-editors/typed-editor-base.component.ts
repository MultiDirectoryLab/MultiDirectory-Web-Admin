import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-typed-editor-base',
    template: ''
})
export class TypedEditorBaseComponent {
    protected _propertyValue?: any;
    @Input() set propertyValue(val: any) {
        this._propertyValue = val;
        this.propertyValueChange.next(val);
    }
    get propertyValue(): any {
        return this._propertyValue;
    }
    @Output() propertyValueChange = new EventEmitter<any>()
}