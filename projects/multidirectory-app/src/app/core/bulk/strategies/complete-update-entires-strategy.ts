import { Injectable } from '@angular/core';
import { BulkCompleteStrategy } from '../bulk-complete-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { combineLatest, Observable } from 'rxjs';
import { UpdateEntryResponse } from '@models/entry/update-response';

@Injectable({
  providedIn: 'root',
})
export class CompleteUpdateEntiresStrategies extends BulkCompleteStrategy<LdapAttributes> {
  constructor(
    private attributes: AttributeService,
    private api: MultidirectoryApiService,
  ) {
    super();
  }

  override complete<RESULT>(accessors: LdapAttributes[]): Observable<RESULT> {
    const updatesRx: Observable<UpdateEntryResponse>[] = [];
    accessors.forEach((accessor) => {
      const updateRequest = this.attributes.createAttributeUpdateRequest(accessor);
      updatesRx.push(this.api.update(updateRequest));
    });
    return combineLatest(updatesRx) as Observable<RESULT>;
  }
}
