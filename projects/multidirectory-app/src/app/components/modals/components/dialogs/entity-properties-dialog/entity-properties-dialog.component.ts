import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ComputerPropertiesComponent } from '@features/ldap-properties/computer-properties/computer-properties.component';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { GroupPropertiesComponent } from '@features/ldap-properties/group-properties/group-properties.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { UserPropertiesComponent } from '@features/ldap-properties/user-properties/user-properties.component';
import { EMPTY, finalize, of, switchMap, take } from 'rxjs';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryType } from '@models/core/ldap/ldap-entry-type';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { ConfirmDialogComponent } from '@components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData, ConfirmDialogReturnData } from '@components/modals/interfaces/confirm-dialog.interface';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '@components/modals/interfaces/entity-properties-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { AppWindowsService } from '@services/app-windows.service';
import { ContactPropertiesComponent } from '@features/ldap-properties/contact-properties/contact-properties.component';
import { DataBusService } from '@services/data-bus.service';

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
    ContactPropertiesComponent,
  ],
  templateUrl: './entity-properties-dialog.component.html',
  styleUrl: './entity-properties-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityPropertiesDialogComponent implements OnInit {
  dialogData: EntityPropertiesDialogData = inject(DIALOG_DATA);

  @ViewChild('userProps') userProps!: UserPropertiesComponent;
  @ViewChild('contactProps') contactProps!: ContactPropertiesComponent;
  @ViewChild(DialogComponent, { static: true }) dialogComponent!: DialogComponent;

  EntityTypes = LdapEntryType;
  entityType: LdapEntryType = this.dialogData.entity.type;
  accessor: LdapAttributes = new LdapAttributes([]);
  loaded = false;
  private readonly windows = inject(AppWindowsService);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<EntityPropertiesDialogReturnData, EntityPropertiesDialogComponent> = inject(DialogRef);
  private attributeService: AttributeService = inject(AttributeService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private dataBus = inject(DataBusService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loaded = false;
    this.windows.showSpinner();
    this.api
      .search(SearchQueries.getProperites(this.dialogData.entity.id))
      .pipe(
        take(1),
        finalize(() => {
          this.windows.hideSpinner();
        }),
      )
      .subscribe((props) => {
        const attributes = props.search_result[0].partial_attributes;
        this.loaded = true;
        this.accessor = this.attributeService.getTrackableAttributes(this.dialogData.entity, new LdapAttributes(attributes));
        this.cdr.detectChanges();
      });
  }

  close(): void {
    this.dialogService.close(this.dialogRef);
  }

  save(needConfirmation = false) {
    this.dialogComponent.showSpinner();
    const updateRequest = this.attributeService.createAttributeUpdateRequest(this.accessor);
    const hasChanges = updateRequest.changes.length > 0;

    if (!hasChanges || (this.userProps && !this.userProps.generalPropertiesValid)) {
      this.dialogComponent.hideSpinner();
      this.close();

      return false;
    }

    const confirmObservable$ = !needConfirmation
      ? of<ConfirmDialogReturnData>(true)
      : this.dialogService.open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>({
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
      }).closed;

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
        finalize(() => {
          this.dialogComponent.hideSpinner();
        }),
      )
      .subscribe({
        next: () => {
          if (hasChanges) {
            this.dataBus.emitUpdateGridContent();
          }

          this.close();
        },
      });
    return false;
  }
}
