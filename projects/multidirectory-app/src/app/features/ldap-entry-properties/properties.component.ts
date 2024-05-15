import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { Subject, take } from 'rxjs';

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
    private toastr: ToastrService,
    private modalControl: ModalInjectDirective,
    private attributes: AttributeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (!this.modalControl.contentOptions?.accessor) {
      return;
    }
    this.accessor = this.modalControl.contentOptions.accessor;
    this.entityType = this.modalControl.contentOptions.entityType;
    this.cdr.detectChanges();
    this.modalControl.modal?.resize();
  }

  close() {
    this.modalControl.close();
  }

  save() {
    this.modalControl.modal?.showSpinner();
    const updateRequest = this.attributes.createAttributeUpdateRequest(this.accessor);
    this.api
      .update(updateRequest)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.modalControl.modal?.hideSpinner();
          this.modalControl.close();
        },
        error: (err) => {
          this.toastr.error(err);
          this.modalControl?.modal?.hideSpinner();
        },
      });
  }
}
