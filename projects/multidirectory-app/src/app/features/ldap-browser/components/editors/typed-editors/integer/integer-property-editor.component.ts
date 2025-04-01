import { Component } from '@angular/core';
import { TypedEditorBaseComponent } from '../typed-editor-base.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-integer-property-editor',
  templateUrl: './integer-property-editor.component.html',
  styleUrls: ['./integer-property-editor.component.scss'],
  standalone: true,
  imports: [MultidirectoryUiKitModule, FormsModule],
})
export class IntegerPropertyEditorComponent extends TypedEditorBaseComponent {}
