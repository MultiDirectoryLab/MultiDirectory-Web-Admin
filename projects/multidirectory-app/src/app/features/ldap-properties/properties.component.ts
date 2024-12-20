import { Component, OnInit } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { AppWindowsService } from '@services/app-windows.service';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { EMPTY, Subject, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-properties',
  styleUrls: ['./properties.component.scss'],
  templateUrl: './properties.component.html',
})
export class EntityPropertiesComponent implements OnInit {
  EntityTypes = LdapEntryType;
  unsubscribe = new Subject<boolean>();
  accessor: LdapAttributes = {};
  entityType = LdapEntryType.None;

  constructor(
    private api: MultidirectoryApiService,
    private modalControl: ModalInjectDirective,
    private attributes: AttributeService,
    private windows: AppWindowsService,
  ) {}

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
