import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberComponent } from 'multidirectory-ui-kit';
import { TypedEditorBaseComponent } from '../typed-editor-base.component';

@Component({
  selector: 'app-integer-property-editor',
  templateUrl: './integer-property-editor.component.html',
  styleUrls: ['./integer-property-editor.component.scss'],
  imports: [NumberComponent, FormsModule],
})
export class IntegerPropertyEditorComponent extends TypedEditorBaseComponent {}
