import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { EntityDetailsDialogData } from './entities-details-dialog.interface';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule, TabDirective } from 'multidirectory-ui-kit';
import { EntityDetailEntriesComponent } from './entity-detail-entries/entity-detail-entries.component';
import { EntityDetailObjectClassesComponent } from './entity-detail-object-classes/entity-detail-object-classes.component';

@Component({
  imports: [
    DialogComponent,
    CommonModule,
    MultidirectoryUiKitModule,
    TranslocoModule,
    EntityDetailEntriesComponent,
    EntityDetailObjectClassesComponent,
  ],
  templateUrl: './entities-details-dialog.component.html',
  styleUrl: './entities-details-dialog.component.scss',
})
export class EntitiesDetailsDialogComponent {
  private dialogData: EntityDetailsDialogData = inject<EntityDetailsDialogData>(DIALOG_DATA);
  entity: SchemaEntity = this.dialogData.entity;
}
