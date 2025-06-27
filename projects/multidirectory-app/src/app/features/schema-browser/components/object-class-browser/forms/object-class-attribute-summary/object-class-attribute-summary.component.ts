import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DialogService } from '@components/modals/services/dialog.service';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import {
  ObjectClassAttributeEditorDialogData,
  ObjectClassAttributeEditorDialogReturnData,
} from '../object-class-attribute-editor/object-class-attribute-editor.interface';
import { ObjectClassAttributeEditorComponent } from '../object-class-attribute-editor/object-class-attribute-editor.component';

@Component({
  selector: 'app-object-class-attribute-summary',
  imports: [TranslocoModule, MultidirectoryUiKitModule, CommonModule],
  templateUrl: './object-class-attribute-summary.component.html',
  styleUrl: './object-class-attribute-summary.component.scss',
})
export class ObjectClassAttributeSummaryComponent {
  private dialog = inject(DialogService);

  openObjectClassEditor() {
    this.dialog.open<
      ObjectClassAttributeEditorDialogReturnData,
      ObjectClassAttributeEditorDialogData,
      ObjectClassAttributeEditorComponent
    >({
      component: ObjectClassAttributeEditorComponent,
      dialogConfig: {
        data: {},
      },
    });
  }
}
