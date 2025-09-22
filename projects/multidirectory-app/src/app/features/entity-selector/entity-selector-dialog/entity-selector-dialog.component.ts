import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { EntitySelectorDialogData } from '@components/modals/interfaces/entity-selector-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { EntitySelectorComponent } from '../entity-selector.component';

@Component({
  selector: 'app-entity-selector-dialog',
  standalone: true,
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    TranslocoPipe,
    FormsModule,
    EntitySelectorComponent,
  ],
  templateUrl: './entity-selector-dialog.component.html',
  styleUrl: './entity-selector-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitySelectorDialogComponent {
  private readonly dialogService = inject(DialogService);
  private readonly dialogRef = inject(DialogRef);
  readonly settings = inject<EntitySelectorDialogData>(DIALOG_DATA);
  readonly selector = viewChild.required<EntitySelectorComponent>('selector');

  close(): void {
    this.dialogService.close(this.dialogRef);
  }

  finish(): void {
    this.dialogService.close(this.dialogRef, this.selector().selectedData);
  }
}
