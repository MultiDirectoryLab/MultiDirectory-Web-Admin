import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-string-property-editor',
    templateUrl: './string-property-editor.component.html',
    styleUrls: ['./string-property-editor.component.scss']
})
export class StringPropertyEditorComponent {
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