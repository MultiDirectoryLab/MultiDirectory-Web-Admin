import { Component, input } from '@angular/core';
import { DialogComponent } from '../../../../../../components/modals/components/core/dialog/dialog.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';

@Component({
  selector: 'app-object-class-attribute-editor',
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './object-class-attribute-editor.component.html',
  styleUrl: './object-class-attribute-editor.component.scss',
})
export class ObjectClassAttributeEditorComponent {
  objectClass = input.required<SchemaObjectClass>();
}
