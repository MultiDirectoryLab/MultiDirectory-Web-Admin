import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ComputerPropertiesComponent } from '@features/ldap-properties/computer-properties/computer-properties.component';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { GroupPropertiesComponent } from '@features/ldap-properties/group-properties/group-properties.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { UserPropertiesComponent } from '@features/ldap-properties/user-properties/user-properties.component';
import { EMPTY, of, switchMap, take } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '../../../interfaces/entity-properties-dialog.interface';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../../interfaces/confirm-dialog.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryType } from '@models/core/ldap/ldap-entry-type';

@Component({
  selector: 'app-entity-properties-dialog',
  standalone: true,
  imports: [
    ComputerPropertiesComponent,
    DialogComponent,
    EntityAttributesComponent,
    GroupPropertiesComponent,
    MultidirectoryUiKitModule,
    TranslocoPipe,
    UserPropertiesComponent,
  ],
  templateUrl: './entity-properties-dialog.component.html',
  styleUrl: './entity-properties-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityPropertiesDialogComponent implements OnInit {
  public dialogData: EntityPropertiesDialogData = inject(DIALOG_DATA);

  @ViewChild(DialogComponent, { static: true }) dialogComponent!: DialogComponent;

  public EntityTypes = LdapEntryType;
  public entityType: LdapEntryType = this.dialogData.entity.type;
  public accessor: LdapAttributes = new LdapAttributes([]);

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<EntityPropertiesDialogReturnData, EntityPropertiesDialogComponent> =
    inject(DialogRef);
  private attributeService: AttributeService = inject(AttributeService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    console.log(this.dialogData.entity.type);
    this.api
      .search(SearchQueries.getProperites(this.dialogData.entity.id))
      .pipe(take(1))
      .subscribe((props) => {
        const attributes = props.search_result[0].partial_attributes;

        this.accessor = this.attributeService.getTrackableAttributes(
          this.dialogData.entity,
          new LdapAttributes(attributes),
        );

        this.cdr.detectChanges();
      });
  }

  public close(): void {
    this.dialogService.close(this.dialogRef);
  }

  public save(needConfirmation = false) {
    this.dialogComponent.showSpinner();
    const updateRequest = this.attributeService.createAttributeUpdateRequest(this.accessor);

    if (updateRequest.changes.length == 0) {
      this.dialogComponent.hideSpinner();
      this.close();

      return false;
    }

    const confirmObservable$ = !needConfirmation
      ? of<ConfirmDialogReturnData>(true)
      : this.dialogService.open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>(
          {
            component: ConfirmDialogComponent,
            dialogConfig: {
              minHeight: '160px',
              data: {
                promptHeader: translate('confirmation-dialog.prompt-header'),
                promptText: translate('confirmation-dialog.prompt-text'),
                primaryButtons: [{ id: true, text: translate('confirmation-dialog.yes') }],
                secondaryButtons: [
                  { id: false, text: translate('confirmation-dialog.no') },
                  { id: 'cancel', text: translate('confirmation-dialog.cancel') },
                ],
              },
            },
          },
        ).closed;

    confirmObservable$
      .pipe(
        take(1),
        switchMap((result) => {
          if (result === true) {
            return this.api.update(updateRequest);
          }
          this.dialogComponent.hideSpinner();

          if (result === 'cancel') {
            return EMPTY;
          }

          return of('');
        }),
      )
      .subscribe({
        next: () => {
          this.dialogComponent.hideSpinner();
          this.close();
        },
        error: (err) => {
          this.dialogComponent.hideSpinner();

          throw err;
        },
      });
    return false;
  }
}
