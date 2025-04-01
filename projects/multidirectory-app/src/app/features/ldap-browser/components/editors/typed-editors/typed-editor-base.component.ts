import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-typed-editor-base',
  template: '',
  standalone: true,
})
export class TypedEditorBaseComponent {
  @Output() propertyValueChange = new EventEmitter<any>();

  protected _propertyValue?: any;

  get propertyValue(): any {
    return this._propertyValue;
  }

  @Input() set propertyValue(val: any) {
    this._propertyValue = val;
    this.propertyValueChange.next(val);
  }
}
