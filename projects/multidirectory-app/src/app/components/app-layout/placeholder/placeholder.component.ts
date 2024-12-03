import { Component, OnDestroy, OnInit } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { SearchQueries } from '@core/ldap/search';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppSettingsService } from '@services/app-settings.service';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapNodeMock } from '@testing/ldap-entry-node-mock';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-placeholder',
  styleUrls: ['./placeholder.component.scss'],
  templateUrl: './placeholder.component.html',
})
export class PlaceholderComponent implements OnInit, OnDestroy {
  private _unsubscribe = new Subject<void>();
  KerberosStatusEnum = KerberosStatuses;
  kerberosStatus = KerberosStatuses.READY;
  accessor?: LdapAttributes;

  constructor(
    private app: AppSettingsService,
    private api: MultidirectoryApiService,
    private attributeService: AttributeService,
    private navigation: AppNavigationService,
  ) {}

  ngOnInit(): void {
    this.app.kerberosStatusRx.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.kerberosStatus = x;
    });

    this.api
      .search(SearchQueries.getProperites('cn=adminlogin,ou=users,dc=md,dc=localhost,dc=dev'))
      .pipe(
        switchMap((props) => {
          const attributes = props.search_result[0].partial_attributes;
          const accessor = this.attributeService.getTrackableAttributes(
            LdapNodeMock,
            new LdapAttributes(attributes),
          );
          return of(accessor);
        }),
      )
      .subscribe((accessor) => {
        this.accessor = accessor;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  clickSave() {
    if (!this.accessor) {
      return;
    }
    const updateRequest = this.attributeService.createAttributeUpdateRequest(this.accessor);
    this.api.update(updateRequest).subscribe((x) => {
      this.navigation.reload();
    });
  }
}
