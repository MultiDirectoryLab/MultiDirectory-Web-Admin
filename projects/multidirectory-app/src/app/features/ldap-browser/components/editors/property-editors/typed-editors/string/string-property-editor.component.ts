import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextboxComponent } from 'multidirectory-ui-kit';
import { TypedEditorBaseComponent } from '../typed-editor-base.component';

@Component({
  selector: 'app-string-property-editor',
  templateUrl: './string-property-editor.component.html',
  styleUrls: ['./string-property-editor.component.scss'],
  imports: [TextboxComponent, FormsModule],
})
export class StringPropertyEditorComponent extends TypedEditorBaseComponent {}
