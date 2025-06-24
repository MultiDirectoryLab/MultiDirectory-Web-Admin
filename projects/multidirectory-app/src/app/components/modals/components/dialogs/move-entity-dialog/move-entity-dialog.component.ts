import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  MoveEntityDialogData,
  MoveEntityDialogReturnData,
} from '../../../interfaces/move-entity-dialog.interface';
import { EntitySelectorDialogComponent } from '../entity-selector-dialog/entity-selector-dialog.component';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
} from '../../../interfaces/entity-selector-dialog.interface';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { take } from 'rxjs';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { ModifyDnRequest } from '@models/api/modify-dn/modify-dn';
import { NavigationNode } from '@models/core/navigation/navigation-node';

@Component({
  selector: 'app-move-entity-dialog',
  standalone: true,
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoPipe, FormsModule],
  templateUrl: './move-entity-dialog.component.html',
  styleUrl: './move-entity-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveEntityDialogComponent {
  public targetDn = '';

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<MoveEntityDialogReturnData, MoveEntityDialogComponent> =
    inject(DialogRef);
  private dialogData: MoveEntityDialogData = inject(DIALOG_DATA);

  public toMove: NavigationNode[] = this.dialogData.toMove;
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public change() {
    this.dialogService
      .open<
        EntitySelectorDialogReturnData,
        EntitySelectorDialogData,
        EntitySelectorDialogComponent
      >({
        component: EntitySelectorDialogComponent,
        dialogConfig: {
          minHeight: '360px',
          data: {
            selectedEntities: [],
            selectedEntityTypes: ENTITY_TYPES.filter((x) => x.id == 'catalogs') ?? [],
            allowSelectEntityTypes: false,
            entityToMove: this.toMove,
            selectedPlaceDn: '',
          },
        },
      })
      .closed.pipe(take(1))
      .subscribe((x) => {
        if (x) {
          this.targetDn = x[0].id;
          this.cdr.detectChanges();
        }
      });
  }

  public move() {
    const request = new ModifyDnRequest();
    const fromDn = this.toMove[0].id;

    request.new_superior = this.targetDn;
    request.entry = fromDn;
    request.newrdn = LdapNamesHelper.getDnName(fromDn);
    request.deleteoldrdn = true;

    this.dialogService.close(this.dialogRef, request);
  }

  public cancel(): void {
    this.dialogService.close(this.dialogRef);
  }
}
