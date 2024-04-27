import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypedEditorBaseComponent } from '../typed-editor-base.component';

@Component({
  selector: 'app-string-property-editor',
  templateUrl: './string-property-editor.component.html',
  styleUrls: ['./string-property-editor.component.scss'],
})
export class StringPropertyEditorComponent extends TypedEditorBaseComponent {}
