import { Component, OnInit, inject } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { ComputerPropertiesComponent } from '@features/ldap-properties/computer-properties/computer-properties.component';
import { GroupPropertiesComponent } from '@features/ldap-properties/group-properties/group-properties.component';
import { UserPropertiesComponent } from '@features/ldap-properties/user-properties/user-properties.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { AppWindowsService } from '@services/app-windows.service';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ButtonComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { EMPTY, of, Subject, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-properties',
  styleUrls: ['./properties.component.scss'],
  templateUrl: './properties.component.html',
  imports: [
    UserPropertiesComponent,
    GroupPropertiesComponent,
    TranslocoPipe,
    ComputerPropertiesComponent,
    EntityAttributesComponent,
    ButtonComponent,
  ],
})
export class EntityPropertiesComponent implements OnInit {
  private api = inject(MultidirectoryApiService);
  private modalControl = inject(ModalInjectDirective);
  private attributes = inject(AttributeService);
  private windows = inject(AppWindowsService);

  EntityTypes = LdapEntryType;
  unsubscribe = new Subject<boolean>();
  accessor: LdapAttributes = {};
  entityType = LdapEntryType.None;

  ngOnInit(): void {
    if (!this.modalControl.contentOptions?.accessor) {
      return;
    }
    this.accessor = this.modalControl.contentOptions.accessor;
    this.entityType = this.modalControl.contentOptions.entityType;
    this.modalControl.closeWrapperFn = (result) => this.save();
  }

  close() {
    this.modalControl.close();
  }

  save(askConfirmation = false): boolean {
    this.modalControl.modal?.showSpinner();
    const updateRequest = this.attributes.createAttributeUpdateRequest(this.accessor);

    const prompt: ConfirmDialogDescriptor = {
      promptHeader: translate('confirmation-dialog.prompt-header'),
      promptText: translate('confirmation-dialog.prompt-text'),
      primaryButtons: [{ id: 'yes', text: translate('confirmation-dialog.yes') }],
      secondaryButtons: [
        { id: 'no', text: translate('confirmation-dialog.no') },
        { id: 'cancel', text: translate('confirmation-dialog.cancel') },
      ],
    };

    if (updateRequest.changes.length == 0) {
      this.modalControl.hideSpinner();
      this.modalControl.close();
      return false;
    }
    const confirmRx = !!askConfirmation ? of('yes') : this.windows.openConfirmDialog(prompt);
    confirmRx
      .pipe(take(1))
      .pipe(
        switchMap((result) => {
          if (result === 'yes') {
            return this.api.update(updateRequest);
          }
          this.modalControl.modal?.hideSpinner();

          if (result === 'cancel' || !result) {
            return EMPTY;
          }
          return of('');
        }),
      )
      .subscribe({
        next: () => {
          this.modalControl.modal?.hideSpinner();
          this.modalControl.close();
        },
        error: (err) => {
          this.modalControl?.modal?.hideSpinner();
          throw err;
        },
      });
    return false;
  }
}
