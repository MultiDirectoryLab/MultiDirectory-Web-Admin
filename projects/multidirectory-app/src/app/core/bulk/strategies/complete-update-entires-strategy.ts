import { Injectable, inject } from '@angular/core';
import { BulkCompleteStrategy } from '../bulk-complete-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { AttributeService } from '@services/attributes.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { combineLatest, Observable } from 'rxjs';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { UpdateEntryRequest } from '@models/api/entry/update-request';

@Injectable({
  providedIn: 'root',
})
export class CompleteUpdateEntiresStrategies extends BulkCompleteStrategy<LdapAttributes> {
  private attributes = inject(AttributeService);
  private api = inject(MultidirectoryApiService);

  override complete<RESULT>(accessors: LdapAttributes[]): Observable<RESULT> {
    const updatesRx: Observable<UpdateEntryResponse>[] = [];
    const updateRequestData: UpdateEntryRequest[] = accessors.map((accessor) =>
      this.attributes.createAttributeUpdateRequest(accessor),
    );
    updatesRx.push(this.api.updateMany(updateRequestData));
    return combineLatest(updatesRx) as Observable<RESULT>;
  }
}
