import { Component, Input } from '@angular/core';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { UserCreateRequest } from '@models/user-create/user-create.request';
import { UserCreateService } from '@services/user-create.service';

@Component({
  selector: 'app-user-create-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class UserCreateSummaryComponent {
  @Input() setupRequest!: UserCreateRequest;

  constructor(public setup: UserCreateService) {}
}
