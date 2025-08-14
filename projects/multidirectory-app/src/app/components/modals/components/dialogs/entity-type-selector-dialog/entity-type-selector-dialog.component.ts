import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  EntityTypeSelectorDialogData,
  EntityTypeSelectorDialogReturnData,
} from '../../../interfaces/entity-type-selector-dialog.interface';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { MultidirectoryUiKitModule, Treenode } from 'multidirectory-ui-kit';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-entity-type-selector-dialog',
  standalone: true,
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoPipe],
  templateUrl: './entity-type-selector-dialog.component.html',
  styleUrl: './entity-type-selector-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityTypeSelectorDialogComponent implements OnInit {
  tree = ENTITY_TYPES.map((x) => new Treenode({ id: x.id, name: x.name }));

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<
    EntityTypeSelectorDialogReturnData,
    EntityTypeSelectorDialogComponent
  > = inject(DialogRef);
  private dialogData: EntityTypeSelectorDialogData = inject(DIALOG_DATA);

  ngOnInit(): void {
    const selected = this.dialogData.selectedEntityTypes;

    this.tree.forEach((x) => {
      x.selected = selected.findIndex((select) => select.id == x.id) > -1;
    });
  }

  close() {
    this.dialogService.close(this.dialogRef);
  }

  finish() {
    const selectedItems = this.tree.filter((x) => x.selected).map((x) => x.id);
    const result = ENTITY_TYPES.filter((x) => selectedItems.includes(x.id));

    this.dialogService.close(this.dialogRef, result);
  }
}
