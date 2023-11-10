import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-integer-property-editor',
    templateUrl: './integer-property-editor.component.html',
    styleUrls: ['./integer-property-editor.component.scss']
})
export class IntegerPropertyEditorComponent {
    private _propertyValue = '';
    @Input() set propertyValue(val: string) {
        this._propertyValue = val;
        this.propertyValueChange.next(val);
    }
    get propertyValue(): string {
        return this._propertyValue;
    }
    @Output() propertyValueChange = new EventEmitter<string>()
}