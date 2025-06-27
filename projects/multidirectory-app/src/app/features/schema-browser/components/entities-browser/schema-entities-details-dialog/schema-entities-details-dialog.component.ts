import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaEntityDetailsDialogData } from './schema-entities-details-dialog.interface';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule, TabDirective } from 'multidirectory-ui-kit';
import { SchemaEntityDetailEntriesComponent } from './schema-entity-detail-entries/schema-entity-detail-entries.component';
import { SchemaEntityDetailObjectClassesComponent } from './schema-entity-detail-object-classes/schema-entity-detail-object-classes.component';

@Component({
  imports: [
    DialogComponent,
    CommonModule,
    MultidirectoryUiKitModule,
    TranslocoModule,
    SchemaEntityDetailEntriesComponent,
    SchemaEntityDetailObjectClassesComponent,
  ],
  templateUrl: './schema-entities-details-dialog.component.html',
  styleUrl: './schema-entities-details-dialog.component.scss',
})
export class EntitiesDetailsDialogComponent {
  private dialogData: SchemaEntityDetailsDialogData =
    inject<SchemaEntityDetailsDialogData>(DIALOG_DATA);
  entity: SchemaEntity = this.dialogData.entity;

  apply() {}
  cancel() {}
}
