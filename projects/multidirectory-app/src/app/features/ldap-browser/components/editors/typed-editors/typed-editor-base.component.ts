import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-typed-editor-base',
  template: '',
})
export class TypedEditorBaseComponent {
  readonly propertyValueChange = output<any>();

  protected _propertyValue?: any;

  get propertyValue(): any {
    return this._propertyValue;
  }

  @Input() set propertyValue(val: any) {
    this._propertyValue = val;
    this.propertyValueChange.emit(val);
  }
}
