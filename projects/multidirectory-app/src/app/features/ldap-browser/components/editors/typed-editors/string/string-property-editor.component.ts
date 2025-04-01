import { Component } from '@angular/core';
import { TypedEditorBaseComponent } from '../typed-editor-base.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-string-property-editor',
  templateUrl: './string-property-editor.component.html',
  styleUrls: ['./string-property-editor.component.scss'],
  standalone: true,
  imports: [MultidirectoryUiKitModule, FormsModule],
})
export class StringPropertyEditorComponent extends TypedEditorBaseComponent {}
